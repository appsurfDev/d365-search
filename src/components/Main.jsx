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
import { fieldsConfig, EntityName, tableConfig } from '../Config.jsx'

const theme = createTheme();

class Main extends React.Component {
    constructor(props) {
        super(props)
        this.componentDidMount = this.componentDidMount.bind(this)
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
              self.state[f.schemaName] = ""
              break;
            case "optionset": 
              self.state[f.schemaName] = []
              self.state[`selected_${f.schemaName}`] = []
              break;
            case "lookup":
              self.state[f.schemaName] = []
              self.state[`selected_${f.schemaName}`] = []
              break;
            default: 
              break;
          }
        })
    }

    async componentDidMount() {
      console.log("Main componentDidMount")
      this.setState({ loading: true })

      for (const f of fieldsConfig) {
        switch(f.type) {
          case "optionset": 
            var results = await this.getOptionSetMetadata(f.schemaName)
            this.setState({ [f.schemaName]: results })
            break;
          case "lookup": 
            results = await this.getLookUpMetadata(f.lookupConfig)
            this.setState({ [f.schemaName]: results })
            break;
          default:
            break;
        }
      }

      this.setState({ loading: false })
    }

    // custom function
    onRowClick(event, rowData) {
      console.log("Main onRowClick")
      window.Xrm.Utility.openEntityForm("contact", rowData.contactid, null, {openInNewWindow: true})
    }

    dsiplaySearch() {
      this.setState({ loading: false, showData: false })
    }

    onSubmit() {
      console.log("Main onSubmit")
      var self = this
      this.setState({ loading: true, showData: false })
      
      // build filter query
      var isNullFilter = true
      var addedFirstFilter = false
      var addedFirstFilterField = false
      var filter = "?$filter="
      fieldsConfig.forEach((f) => {
        switch(f.type) {
          case "string": 
            if(this.state[f.schemaName]) {
              isNullFilter = false
              if(this.state[f.schemaName].indexOf(',') === -1){
                if(addedFirstFilter) {
                  filter += `and (contains(${f.schemaName}, '${this.state[f.schemaName]}'))`
                }
                else {
                  addedFirstFilter = true
                  addedFirstFilterField = true
                  filter += `contains(${f.schemaName}, '${this.state[f.schemaName]}')`
                }
              }
              else {
                var strs = this.state[f.schemaName].split(',');
                strs.forEach((s, i, arr) => {
                  if(addedFirstFilter) {
                    if(i === 0) {
                      filter += `and (contains(${f.schemaName}, '${s}')`
                    }
                    else {
                      filter += `or contains(${f.schemaName}, '${s}')`
                    }
                    if(i === (arr.length - 1)) {
                      if(addedFirstFilterField) {
                        filter += ")"
                      }
                      else {
                        addedFirstFilterField = true
                      }
                    }
                  }
                  else {
                    addedFirstFilter = true
                    if(i === (arr.length - 1)) {
                      addedFirstFilterField = true
                    }
                    filter += `contains(${f.schemaName}, '${s}')`
                  }
                })
              }
            }
            break;
          case "optionset": 
            if(this.state[`selected_${f.schemaName}`].length > 0) {
              isNullFilter = false
              this.state[`selected_${f.schemaName}`].forEach((so, i, arr) => {
                if(addedFirstFilter) {
                  if(i === 0) {
                    filter += `and (${f.schemaName} eq ${so.attributevalue}`
                  }
                  else {
                    filter += `or ${f.schemaName} eq ${so.attributevalue}`
                  }
                  if(i === (arr.length - 1)) {
                    if(addedFirstFilterField) {
                      filter += ")"
                    }
                    else {
                      addedFirstFilterField = true
                    }
                  }
                }
                else{
                  addedFirstFilter = true
                  if(i === (arr.length - 1)) {
                    addedFirstFilterField = true
                  }
                  filter += `${f.schemaName} eq ${so.attributevalue}`
                }
              })
            }
            break;
          case "lookup":
            if(this.state[`selected_${f.schemaName}`].length > 0) {
              isNullFilter = false
              this.state[`selected_${f.schemaName}`].forEach((so, i ,arr) => {
                if(addedFirstFilter) {
                  if(i === 0) {
                    filter += `and (_${f.schemaName}_value eq '${so[f.lookupConfig.primaryIDName]}'`
                  }
                  else {
                    filter += `or _${f.schemaName}_value eq '${so[f.lookupConfig.primaryIDName]}'`
                  }
                  if(i === (arr.length - 1)) {
                    if(addedFirstFilterField) {
                      filter += ")"
                    }
                    else {
                      addedFirstFilterField = true
                    }
                  }
                  
                }
                else{
                  addedFirstFilter = true
                  if(i === (arr.length - 1)) {
                    addedFirstFilterField = true
                  }
                  filter += `_${f.schemaName}_value eq '${so[f.lookupConfig.primaryIDName]}'`
                }
              })
            }
            break;
          default:
            break;
        }
      });

      console.log("filter: ", filter)
      if(isNullFilter) {
        window.alert("You need to input at least one field")
        this.setState({ loading: false, showData: false })
      }
      else{
        var expand = ""
        fieldsConfig.forEach((f) => {
          if(f.type === "lookup") {
              expand += `&$expand=${f.schemaName}_${f.lookupConfig.entityName}`
          }
        })

        window.Xrm.WebApi.retrieveMultipleRecords(EntityName, filter + expand).then(
          function success(result) {
            if (result.entities.length === 0) {
              window.alert("There is no any data match the query.")
              self.setState({ 
                data: [],
                loading: false, 
                showData: false 
              })
            }
            else {
              var entities = result.entities
              entities.forEach((e) => {
                fieldsConfig.forEach((f) => {
                  switch(f.type) {
                    case "optionset":
                      e[f.schemaName] = e[`${f.schemaName}@OData.Community.Display.V1.FormattedValue`]
                      break
                    case "lookup": 
                      e[f.schemaName] = e[`${f.schemaName}_${f.lookupConfig.entityName}`][f.lookupConfig.primaryName] 
                      break
                    default:
                      break
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
              console.log(error.message);
              window.alert("Error: " + error.message)
              self.setState({ 
                data: [],
                loading: false, 
                showData: false
              })
          }
        );
      }
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

    async getOptionSetMetadata(schemaName) {
      var optionSetFetch = `<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>
        <entity name='stringmap' >
          <attribute name='attributevalue' />
          <attribute name='value' />
          <filter type='and' >
            <condition attribute='objecttypecodename' operator='eq' value= '${EntityName}' />
            <condition attribute='attributename' operator='eq' value= '${schemaName}' />
          </filter>
        </entity>
      </fetch>`;
      optionSetFetch = "?fetchXml=" + encodeURIComponent(optionSetFetch);
      console.log("optionSetFetch: ", optionSetFetch)

      var result = await window.Xrm.WebApi.retrieveMultipleRecords("stringmap", optionSetFetch)
      if (result.entities.length > 0) {
        console.log(`get ${schemaName}: `, result.entities);
        return result.entities
      }
      window.alert(`Get string map ${schemaName} return no data`)
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
        console.log(`get ${config.entityName}: `, result.entities);
        return result.entities
      }
      window.alert(`Get lookup ${config.entityName} return no data`)
    }

    render() {
      const { data, showData, loading } = this.state
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
                    fieldsConfig.map((f) => {
                      switch(f.type) {
                        case "string":
                          return (
                            <TextField
                              margin="dense"
                              fullWidth
                              id={f.schemaName}
                              label={f.displayName}
                              name={f.schemaName}
                              value={this.state[f.schemaName]}
                              size="small"
                              onChange={this.onTextChange}
                              style={{ margin: 3 }}
                            />
                          )
                        case "optionset":
                          return (
                            <Multiselect
                              id={f.schemaName}
                              placeholder={f.displayName}
                              hidePlaceholder={true}
                              options={this.state[f.schemaName]} 
                              selectedValues={this.state[`selected_${f.schemaName}`]}
                              showCheckbox={true}
                              onSelect={(list) => this.onSelect(`selected_${f.schemaName}`, list)} 
                              onRemove={(list) => this.onRemove(`selected_${f.schemaName}`, list)}
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
                              id={f.schemaName}
                              placeholder={f.displayName}
                              hidePlaceholder={true}
                              options={this.state[f.schemaName]} 
                              selectedValues={this.state[`selected_${f.schemaName}`]}
                              showCheckbox={true}
                              onSelect={(list) => this.onSelect(`selected_${f.schemaName}`, list)} 
                              onRemove={(list) => this.onRemove(`selected_${f.schemaName}`, list)}
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
                options={tableConfig}
                title=""
              />
            </Grid>
          </Grid>}
        </ThemeProvider>
      )
    }
}

export default Main;