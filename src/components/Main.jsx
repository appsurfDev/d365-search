import React from 'react';
import MaterialTable from 'material-table';
import {
  Avatar,
  CssBaseline,
  Box,
  Grid,
  TextField,
  Typography,
  Container
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ReactiveButton from 'reactive-button'
import Multiselect from 'multiselect-react-dropdown';
import { fieldsConfig, EntityName } from '../Config.jsx'

const theme = createTheme();

class Main extends React.Component {
    constructor(props) {
        super(props)
        this.onSubmit = this.onSubmit.bind(this)
        this.dsiplaySearch = this.dsiplaySearch.bind(this)
        this.onTextChange = this.onTextChange.bind(this)
        this.onSelect = this.onSelect.bind(this)
        this.onRemove = this.onRemove.bind(this)
        this.getOptionSetMetadata = this.getOptionSetMetadata.bind(this)
        this.getLookUpMetadata = this.getLookUpMetadata.bind(this)
        this.state = {
          data: [],
          showData: false,
          loading: false
        }
        var self = this
        fieldsConfig.forEach((f) => {
          switch(f.type) {
            case "string": 
              self.state[f.field] = ""
              break;
            case "optionset": 
              self.state[f.field] = []
              self.state[`selected_${f.field}`] = []
              break;
            case "lookup":
              self.state[f.field] = []
              self.state[`selected_${f.field}`] = []
              break;
            default: 
              break;
          }
        })
    }

    async componentDidMount() {
      this.setState({ loading: true })  

      var state = sessionStorage.getItem("state")

      if(state !== null && state !== undefined) {
        state = JSON.parse(state)
        this.setState({...state})
      }
      else {
        for (const f of fieldsConfig) {
          switch(f.type) {
            case "optionset": 
              var results = await this.getOptionSetMetadata(f.field)
              this.setState({ [f.field]: results })
              break;
            case "lookup": 
              results = await this.getLookUpMetadata(f.lookupConfig)
              this.setState({ [f.field]: results })
              break;
            default:
              break;
          }
        }
      }
      
      this.setState({ loading: false })
    }

    shouldComponentUpdate(nextProps, nextState) {
      return this.props.value === nextProps.value;
    }

    // custom function
    onRowClick(event, rowData) {
      window.Xrm.Utility.openEntityForm(EntityName, rowData.contactid, null, {openInNewWindow: true})
    }

    dsiplaySearch() {
      var state = this.state
      state["showData"] = false
      state["data"] = []
      sessionStorage.setItem("state", JSON.stringify(state))
      var url = new URL(window.location.href);
      window.location.href = url.href;
    }

    onSubmit() {
      this.setState({ loading: true, showData: false, data: [] })
      var self = this

      var attributeXml = ""
      var filterXml = ""
      var linkEntityXml = ""
      var addedLinkEntityList = []

      fieldsConfig.forEach((f) => {
        if(f.linkEntityConfig.isLinkEntity) {
          if(!addedLinkEntityList.includes(f.linkEntityConfig.linkEntityName)) {
            var linkEntityAttributeXml = ""
            var linkEntityFilterXml = ""

            fieldsConfig
              .filter((of) => {
                return of.linkEntityConfig.linkEntityName === f.linkEntityConfig.linkEntityName
              })
              .forEach((of) => {
                linkEntityAttributeXml += `<attribute name='${of.field}'/>`
                switch(of.type) {
                  case "string":
                    if(this.state[of.field]) {
                      if(this.state[of.field].indexOf(',') === -1) {
                        linkEntityFilterXml += `<condition value='%${this.state[of.field]}%' operator="like" attribute='${of.field}'/>`
                      }
                      else {
                        var strs = this.state[of.field].split(',');
                        strs.forEach((s) => {
                          linkEntityFilterXml += `<condition value='%${s}%' operator="like" attribute='${of.field}'/>`
                        })
                      }
                    }
                    break;
                  case "lookup":
                    if(this.state[`selected_${of.field}`].length > 0) {
                      linkEntityFilterXml += `<condition attribute='${of.field}' operator="in">`
                      this.state[`selected_${of.field}`].forEach((so) => {
                        linkEntityFilterXml += `<value>{${so[of.lookupConfig.primaryIDName]}}</value>`
                      })
                      linkEntityFilterXml += `</condition>`
                    }
                    break;
                  default:
                    break;
                }
              })

            addedLinkEntityList.push(f.linkEntityConfig.linkEntityName)
            var entityFetchXml = `<link-entity name='${f.linkEntityConfig.linkEntityName}' alias='${f.linkEntityConfig.alias}' link-type="outer" to='${f.linkEntityConfig.to}' from='${f.linkEntityConfig.from}'>
                ${linkEntityAttributeXml}
                <filter type="and">
                  ${linkEntityFilterXml}
                </filter>
              </link-entity>
            `
            linkEntityXml += entityFetchXml
          }
        }
        else {
          attributeXml += `<attribute name='${f.field}'/>`
          switch(f.type) {
            case "string": 
              if(this.state[f.field]) {
                if(this.state[f.field].indexOf(',') === -1) {
                  filterXml += `<condition value='%${this.state[f.field]}%' operator="like" attribute='${f.field}'/>`
                }
                else {
                  var strs = this.state[f.field].split(',');
                  var addedFirstFilter = false
                  strs.forEach((s, i, arr) => {
                    if(!addedFirstFilter) {
                      filterXml += `<filter type="or">`
                      addedFirstFilter = true
                    }
                    filterXml += `<condition value='%${s}%' operator="like" attribute='${f.field}'/>`
                    if(i === arr.length - 1) {
                      filterXml += `</filter>`
                    }
                  })
                }
              }
              break;
            case "lookup":
              if(this.state[`selected_${f.field}`].length > 0) {
                filterXml += `<condition attribute='${f.field}' operator="in">`
                this.state[`selected_${f.field}`].forEach((so) => {
                  filterXml += `<value>{${so[f.lookupConfig.primaryIDName]}}</value>`
                })
                filterXml += `</condition>`
              }
              break;
            default:
              break;
          }
        }
      })

      var fetchXml = `<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>
        <entity name='${EntityName}' >
          ${attributeXml}
          <filter type='and' >
            ${filterXml}
          </filter>
          ${linkEntityXml}
        </entity>
      </fetch>`;

      console.log("fetchXml: ", fetchXml)
      var query = "?fetchXml=" + encodeURIComponent(fetchXml)

      window.Xrm.WebApi.retrieveMultipleRecords(EntityName, query).then(
        function success(result) {
          console.log("result: ", result)
          if (result.entities.length === 0) {
            window.alert("There is no any data match the query.")
            self.setState({ 
              loading: false, 
              showData: false,
            })
          }
          else {
            var entities = result.entities
            console.log("entities: ", entities)
            entities.forEach((e) => {
              fieldsConfig.forEach((f) => {
                if(f.linkEntityConfig.isLinkEntity) {
                  switch (f.type) {
                    case "string":
                      if(e[`${f.linkEntityConfig.alias}.${f.field}`]) {
                        e[f.field] = e[`${f.linkEntityConfig.alias}.${f.field}`]
                      }
                      break;
                    case "lookup":
                      if(e[`${f.linkEntityConfig.alias}.${f.field}@OData.Community.Display.V1.FormattedValue`]) {
                        e[f.field] = e[`${f.linkEntityConfig.alias}.${f.field}@OData.Community.Display.V1.FormattedValue`]
                      }
                      else {
                        e[f.field] = null
                      }
                      break;
                    default:
                      break;
                  }
                }
                else {
                    switch (f.type) {
                      case "lookup":
                        e[f.field] = e[`_${f.field}_value@OData.Community.Display.V1.FormattedValue`]
                        break;
                      default:
                        break;
                  }
                }
              })
            })
            self.setState({ 
              data: entities,
              loading: false, 
              showData: true 
            })
          }
        },
        function (error) {
            window.alert("Error: " + error.message)
            self.setState({ 
              data: [],
              loading: false, 
              showData: false
            })
        }
      );
    }

    onTextChange(e) {
      this.setState({
        [e.target.id]: e.target.value
      });
    }

    onSelect(optionName, selectedList) {
      this.setState({ [optionName]: selectedList })
    }
  
    onRemove(optionName, selectedList) {
      this.setState({ [optionName]: selectedList })
    }

    async getOptionSetMetadata(field) {
      var optionSetFetch = `<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>
        <entity name='stringmap' >
          <attribute name='attributevalue' />
          <attribute name='value' />
          <filter type='and' >
            <condition attribute='objecttypecodename' operator='eq' value= '${EntityName}' />
            <condition attribute='attributename' operator='eq' value= '${field}' />
          </filter>
        </entity>
      </fetch>`;
      optionSetFetch = "?fetchXml=" + encodeURIComponent(optionSetFetch);

      var result = await window.Xrm.WebApi.retrieveMultipleRecords("stringmap", optionSetFetch)
      if (result.entities.length > 0) {
        return result.entities
      }
      window.alert(`Get string map ${field} return no data`)
    }

    async getLookUpMetadata(config) {
      var lookUpFetch = `<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>
        <entity name='${config.entityName}' >
          <attribute name='${config.primaryName}' />
          <attribute name='${config.primaryIDName}' />
          <filter type="and">
            <condition attribute="statecode" value="0" operator="eq"/>
          </filter>
        </entity>
      </fetch>`
      lookUpFetch = "?fetchXml=" + encodeURIComponent(lookUpFetch);
      var result = await window.Xrm.WebApi.retrieveMultipleRecords(config.entityName, lookUpFetch)
      if (result.entities.length > 0) {
        return result.entities
      }
      window.alert(`Get lookup ${config.entityName} return no data`)
    }

    render() {
      const { showData, loading, data } = this.state
      return (
        <ThemeProvider theme={theme}>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                marginTop: 0,
                marginBottom: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  marginTop: 0,
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                  <SearchIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Search Page
                </Typography>
              </Box>
              { showData ?  <ReactiveButton
                  buttonState={ loading ? 'loading' : 'idle' }
                  idleText="Display Search"
                  onClick={this.dsiplaySearch}
                  style={{ margin: 3 }}
                /> : <Box component="form" noValidate sx={{ mt: 1 }}>
                  {
                    // eslint-disable-next-line array-callback-return
                    fieldsConfig.map((f) => {
                      switch(f.type) {
                        case "string":
                          return (
                            <TextField
                              margin="dense"
                              fullWidth
                              id={f.field}
                              label={f.title}
                              name={f.field}
                              value={this.state[f.field]}
                              size="small"
                              onChange={this.onTextChange}
                              style={{ margin: 3 }}
                            />
                          )
                        case "optionset":
                          return (
                            <Multiselect
                              id={f.field}
                              placeholder={f.title}
                              hidePlaceholder={true}
                              options={this.state[f.field]} 
                              selectedValues={this.state[`selected_${f.field}`]}
                              showCheckbox={true}
                              onSelect={(list) => this.onSelect(`selected_${f.field}`, list)} 
                              onRemove={(list) => this.onRemove(`selected_${f.field}`, list)}
                              displayValue="value"
                              style={{ 
                                multiselectContainer: {
                                  marginTop: 4,
                                  marginBottom: 4,
                                  marginLeft: 4,
                                  marginRight: 4
                                },
                                searchBox: {
                                  minHeight: 35,
                                  padding: 8.5
                                }
                              }}
                            />
                          )
                        case "lookup":
                          return (
                            <Multiselect
                              id={f.field}
                              placeholder={f.title}
                              hidePlaceholder={true}
                              options={this.state[f.field]} 
                              selectedValues={this.state[`selected_${f.field}`]}
                              showCheckbox={true}
                              onSelect={(list) => this.onSelect(`selected_${f.field}`, list)} 
                              onRemove={(list) => this.onRemove(`selected_${f.field}`, list)}
                              displayValue={f.lookupConfig.primaryName}
                              style={{ 
                                multiselectContainer: {
                                  marginTop: 4,
                                  marginBottom: 4,
                                  marginLeft: 4,
                                  marginRight: 4
                                },
                                searchBox: {
                                  minHeight: 35,
                                  padding: 8.5
                                }
                              }}
                            />
                          )
                        default:
                          break;
                      }
                    }) 
                  }
                <ReactiveButton
                  buttonState={ loading ? 'loading' : 'idle' }
                  idleText="Submit"
                  onClick={this.onSubmit}
                  style={{ margin: 3 }}
                />
              </Box>}
            </Box>
          </Container>
          { showData && <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center" 
          >
            <Grid item xs={12}>
              <MaterialTable
                onRowClick={this.onRowClick}
                columns={fieldsConfig}
                data={data}
                options={{
                  pageSize: data.length >= 25 ? 25 : data.length,
                  pageSizeOptions: [data.length >= 25 ? 25 : data.length, 50, 100, 200],
                  exportFileName: "Alumni_Search_Result",
                  exportButton: true, 
                  exportAllData: true,
                  headerStyle: {
                    backgroundColor: '#01579b',
                    color: '#FFF'
                  }
                }}
                title=""
              />
            </Grid>
          </Grid>}
        </ThemeProvider>
      )
    }
}

export default Main;