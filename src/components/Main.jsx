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
import { fieldsConfig, EntityName, EntityPrimaryIDName } from '../Config.jsx'

const theme = createTheme();

const yearOfGraduationStart = 1939;
const yearOfGraduationEnd  = 2022

class Main extends React.Component {
    constructor(props) {
        super(props)
        this.onSubmit = this.onSubmit.bind(this)
        this.onClear = this.onClear.bind(this)
        this.dsiplaySearch = this.dsiplaySearch.bind(this)
        this.onTextChange = this.onTextChange.bind(this)
        this.onSelect = this.onSelect.bind(this)
        this.onRemove = this.onRemove.bind(this)
        this.getOptionSetMetadata = this.getOptionSetMetadata.bind(this)
        this.getLookUpMetadata = this.getLookUpMetadata.bind(this)
        this.promiseRetrieveRecords = this.promiseRetrieveRecords.bind(this)
        this.onChangePage = this.onChangePage.bind(this)
        this.state = {
          data: [],
          showData: false,
          loading: false,
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
              if(f.field === "ks_optionyearlist") {
                results = results.filter((r) => {
                  var year = r[f.lookupConfig.primaryName]
                  if(year) {
                    var yearNum = parseInt(year)
                    if(yearNum >= yearOfGraduationStart && yearNum <= yearOfGraduationEnd) {
                      return true
                    }
                  }
                  return false
                })
              }
              else if(f.field === "ks_currentcountry") {
                results = results.sort((x, y) => {
                  return x[f.lookupConfig.primaryName] === "HONG KONG SAR" ? -1 : y[f.lookupConfig.primaryName] === "HONG KONG SAR" ? 1 :0
                })
              }
              else if(f.field === "ks_degree") {
                results = results.sort((x, y) => {
                  return x[f.lookupConfig.primaryName] !== "Others" ? -1 : y[f.lookupConfig.primaryName] !== "Others" ? 1 :0
                })
              }
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
      window.Xrm.Utility.openEntityForm(EntityName, rowData[EntityPrimaryIDName], null, {openInNewWindow: true})
    }

    onChangePage(e, pg) {
      
    }

    dsiplaySearch() {
      var state = this.state
      state["showData"] = false
      state["data"] = []
      sessionStorage.setItem("state", JSON.stringify(state))
      var url = new URL(window.location.href);
      window.location.href = url.href;
    }

    async onSubmit() {
      this.setState({ loading: true, showData: false, data: [] })

      var attributeXml = ""
      var filterXml = ""
      var linkEntityXml = ""
      var addedLinkEntityList = []

      fieldsConfig.forEach((f) => {
        if(f.linkEntityConfig.isLinkEntity) {
          if(!addedLinkEntityList.includes(f.linkEntityConfig.linkEntityName)) {
            var linkEntityAttributeXml = ""
            var subLinkEntityAttributeXml = ""

            fieldsConfig
              .filter((of) => {
                return of.linkEntityConfig.linkEntityName === f.linkEntityConfig.linkEntityName
              })
              .forEach((of) => {
                if(of.linkEntityConfig.isSubLinkEntity) {
                  subLinkEntityAttributeXml += `<attribute name='${of.field}'/>`
                }
                else {
                  linkEntityAttributeXml += `<attribute name='${of.field}'/>`
                }
                switch(of.type) {
                  case "string":
                    if(this.state[of.field]) {
                      var etnName = of.linkEntityConfig.isSubLinkEntity ? of.linkEntityConfig.subLinkEntityConfig.alias :of.linkEntityConfig.alias
                      if(this.state[of.field].indexOf(',') === -1) {
                        filterXml += `<condition entityname='${etnName}' value='%${this.state[of.field]}%' operator="like" attribute='${of.field}'/>`
                      }
                      else {
                        var strs = this.state[of.field].split(',');
                        strs.forEach((s) => {
                          filterXml += `<condition entityname='${etnName}' value='%${s}%' operator="like" attribute='${of.field}'/>`
                        })
                      }
                    }
                    break;
                  case "lookup":
                    if(this.state[`selected_${of.field}`].length > 0) {
                      filterXml += `<condition entityname='${of.linkEntityConfig.alias}' attribute='${of.field}' operator="in">`
                      this.state[`selected_${of.field}`].forEach((so) => {
                        filterXml += `<value>{${so[of.lookupConfig.primaryIDName]}}</value>`
                      })
                      filterXml += `</condition>`
                    }
                    break;
                  default:
                    break;
                }
              })

            addedLinkEntityList.push(f.linkEntityConfig.linkEntityName)
            var entityFetchXml = `<link-entity name='${f.linkEntityConfig.linkEntityName}' alias='${f.linkEntityConfig.alias}' link-type="outer" to='${f.linkEntityConfig.to}' from='${f.linkEntityConfig.from}'>
                <link-entity name='ks_optionprogrammetitle' alias='acp' link-type="outer" to='ks_programtitlelookup' from='ks_optionprogrammetitleid'>
                ${subLinkEntityAttributeXml}
                </link-entity>
                ${linkEntityAttributeXml}
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

      var queryXml = `<entity name='${EntityName}' >
          ${attributeXml}
          <filter type='and' >
            ${filterXml}
          </filter>
          ${linkEntityXml}
        </entity>
      </fetch>`;

      console.log("queryXml: ", queryXml)

      var entities = []
      var moreEntities = []
      var firstFetch = true
      var pageNumber = 1

      do {
        if(firstFetch) {
          moreEntities = await this.fetchRecords(queryXml, false, null, null, null)
          firstFetch = false
          entities = moreEntities
        }
        else {
          var firstRecordID = moreEntities[0].contactid
          var lastRecordID = moreEntities[4999].contactid
          moreEntities = await this.fetchRecords(queryXml, true, pageNumber, firstRecordID, lastRecordID)
          entities = entities.concat(moreEntities)
        }
        pageNumber += 1
      } while (moreEntities.length >= 5000)

      console.log("entities: ", entities)

      if(entities.length === 0) {
        this.setState({
          loading: false, 
          showData: false,
        })
      }
      else {
        this.setState({ 
          data: entities,
          loading: false, 
          showData: true 
        })
      }
    }

    onClear() {
      sessionStorage.removeItem("state");
      var url = new URL(window.location.href);
      window.location.href = url.href;
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
          <order attribute='${config.primaryName}' descending='${config.sortDesc}' />
        </entity>
      </fetch>`
      lookUpFetch = "?fetchXml=" + encodeURIComponent(lookUpFetch);
      var result = await window.Xrm.WebApi.retrieveMultipleRecords(config.entityName, lookUpFetch)
      if (result.entities.length > 0) {
        return result.entities
      }
      window.alert(`Get lookup ${config.entityName} return no data`)
    }

    // custom common function
    async fetchRecords(queryXml, fetchNextRecords, pageNumber, firstRecordID, lastRecordID) {
      console.log("fetch records")

      var entities = []
      
      var fetch = ""

      if(fetchNextRecords) {
        fetch = "<fetch page='"+ pageNumber +"' paging-cookie='&lt;cookie page=&quot;" + (pageNumber - 1) + "&quot;&gt;&lt;contactid last=&quot;" + lastRecordID +"&quot; first=&quot;" + firstRecordID + "&quot; /&gt;&lt;/cookie&gt;'>";
      }
      else {
        fetch = "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>";
      }

      fetch += queryXml
      console.log("fetchXml: ", fetch)
      fetch = "?fetchXml=" + encodeURIComponent(fetch)

      entities = await this.promiseRetrieveRecords(fetch)
      return entities
    }

    promiseRetrieveRecords(fetch) {
      return new Promise(function(resolve, reject) {
        window.Xrm.WebApi.retrieveMultipleRecords(EntityName, fetch).then(
          function success(result) {
            console.log("result: ", result)
            if (result.entities.length === 0) {
            }
            else {
              var entities = result.entities
              entities.forEach((e) => {
                fieldsConfig.forEach((f) => {
                  if(f.linkEntityConfig.isLinkEntity) {
                    switch (f.type) {
                      case "string":
                        if(f.linkEntityConfig.isSubLinkEntity) {
                          if(e[`${f.linkEntityConfig.subLinkEntityConfig.alias}.${f.field}`]) {
                            e[f.field] = e[`${f.linkEntityConfig.subLinkEntityConfig.alias}.${f.field}`]
                          }
                        }
                        else {
                          if(e[`${f.linkEntityConfig.alias}.${f.field}`]) {
                            e[f.field] = e[`${f.linkEntityConfig.alias}.${f.field}`]
                          }
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

              resolve(entities)
            }
          },
          function (error) {
            window.alert("Error: " + error.message)
          }
        );
      })
    }

    render() {
      const { showData, loading, data } = this.state
      return (
        <ThemeProvider theme={theme}>
          <Container component="main" maxWidth="xs" style={{
            marginLeft: showData ? 0 : 'auto',
          }}>
            <CssBaseline />
            <Box
              sx={{
                marginTop: 0,
                marginBottom: 1,
                display: showData ? 'block' : 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              { showData ? <div /> : <Box
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
                <Typography 
                  component="h1" 
                  variant="h5" 
                  style={{
                    fontSize: 25
                  }}
                >
                  Alumni Search
                </Typography>
              </Box> }
              { showData ?  <div /> : <Box component="form" noValidate sx={{ mt: 1 }}>
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
                              style={{ 
                                marginTop: 0,
                                marginBottom: 9.5, 
                                marginLeft: 4,
                                marginRight: 4 
                              }}
                              InputLabelProps={{ style: { fontSize: 15 } }}
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
                                  marginTop: 0,
                                  marginBottom: 9.5,
                                  marginLeft: 4,
                                  marginRight: 4,
                                },
                                searchBox: {
                                  minHeight: 35,
                                  padding: 8.5,
                                  marginBottom: 10
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
                              showArrow={true}
                              onSelect={(list) => this.onSelect(`selected_${f.field}`, list)} 
                              onRemove={(list) => this.onRemove(`selected_${f.field}`, list)}
                              displayValue={f.lookupConfig.primaryName}
                              style={{ 
                                multiselectContainer: {
                                  marginTop: 0,
                                  marginBottom: 4,
                                  marginLeft: 4,
                                  marginRight: 4,
                                },
                                searchBox: {
                                  minHeight: 35,
                                  padding: 8.5,
                                  marginBottom: 8.5
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
                  idleText="Search"
                  onClick={this.onSubmit}
                  style={{ 
                    borderRadius: '10px',
                    backgroundColor: '#A02337'
                  }}
                />
                <ReactiveButton
                  buttonState={ loading ? 'loading' : 'idle' }
                  idleText="Clear"
                  color='secondary'
                  onClick={this.onClear}
                  style={{ 
                    borderRadius: '10px',
                    margin: 10 
                  }}
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
              <ReactiveButton
                  buttonState={ loading ? 'loading' : 'idle' }
                  idleText={
                    <Box
                    sx={{
                      marginTop: 0,
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                      Back to Alumni Search
                    </Box>
                  }
                  onClick={this.dsiplaySearch}
                  style={{ margin: 3, backgroundColor: '#A02337',  borderRadius: '10px', }}
                />
              <MaterialTable
                onRowClick={this.onRowClick}
                onChangePage={this.onChangePage}
                columns={fieldsConfig}
                data={data}
                options={{
                  pageSize: data.length >= 25 ? 25 : data.length,
                  pageSizeOptions: [data.length >= 25 ? 25 : data.length, 50, 100, 200],
                  exportFileName: "Alumni_Search_Result",
                  exportAllData: true,
                  headerStyle: {
                    backgroundColor: '#01579b',
                    color: '#FFF'
                  },
                  tableLayout: "auto",
                  draggable: true,
                  exportButton: {
                    csv: true,
                    pdf: false
                  }
                }}
                localization={{
                  toolbar: {
                    searchPlaceholder: 'Refine Search'
                  },
                  pagination: {
                    labelRowsSelect: 'records',
                    labelRowsPerPage: 'records par page:',
                  }
                }}
                title="Search Result"
                style={{
                  marginTop: 10
                }}
              />
            </Grid>
          </Grid>}
        </ThemeProvider>
      )
    }
}

export default Main;