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
import { TextFieldList } from './TextFieldsConfig'
import { OptionList } from './OptionSetsConfig.jsx'
import { TableColumns } from './TableConfig.jsx'

const theme = createTheme();
const entityName = "contact"

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
        this.state = {
          data: [],
          showData: false,
          loading: false
        }
        var self = this
        TextFieldList.forEach((t) => {
          self.state[t.schemaName] = ""
        })
        OptionList.forEach((o) => {
          self.state[o.schemaName] = []
          self.state[`selected_${o.schemaName}`] = []
        })
    }

    async componentDidMount() {
      console.log("Main componentDidMount")
      this.setState({ loading: true })

      for (const o of OptionList) {
        const results = await this.getOptionSetMetadata(o.schemaName)
        this.setState({ [o.schemaName]: results })
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
      
      var select = "?$select=contactid,fullname,emailaddress1";
      // build filter query
      var isNullFilter = true
      var addedFirstFilter = false
      var filter = "&$filter="
      TextFieldList.forEach((t) => {
        if(this.state[t.schemaName]) {
          isNullFilter = false
          if(this.state[t.schemaName].indexOf(',') === -1){
            if(addedFirstFilter) {
              filter += `or contains(${t.schemaName}, '${this.state[t.schemaName]}')`
            }
            else{
              addedFirstFilter = true
              filter += `contains(${t.schemaName}, '${this.state[t.schemaName]}')`
            }
          }
          else {
            var strs = this.state[t.schemaName].split(',');
            strs.forEach((s) => {
              if(addedFirstFilter) {
                filter += `or contains(${t.schemaName}, '${s}')`
              }
              else{
                addedFirstFilter = true
                filter += `contains(${t.schemaName}, '${s}')`
              }
            })
          }
        }
      })

      OptionList.forEach((o) => {
        if(this.state[`selected_${o.schemaName}`].length > 0) {
          isNullFilter = false
          this.state[`selected_${o.schemaName}`].forEach((so) => {
            if(addedFirstFilter) {
              filter += `or ${o.schemaName} eq ${so.attributevalue}`
            }
            else{
              addedFirstFilter = true
              filter += `${o.schemaName} eq ${so.attributevalue}`
            }
          })
        }
      })

      console.log("filter: ", filter)
      if(isNullFilter) {
        window.alert("You need to input at least one field")
        this.setState({ loading: false, showData: false })
      }
      else{
        window.Xrm.WebApi.retrieveMultipleRecords(entityName, select + filter).then(
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
              self.setState({ 
                data: result.entities,
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
              <condition attribute='objecttypecodename' operator='eq' value= '${entityName}' />
              <condition attribute='attributename' operator='eq' value= '${schemaName}' />
            </filter>
        </entity>
      </fetch>`;
      optionSetFetch = "?fetchXml=" + encodeURIComponent(optionSetFetch);
      console.log("optionSetFetch: ", optionSetFetch)

      var result = await window.Xrm.WebApi.retrieveMultipleRecords("stringmap", optionSetFetch)
      debugger
      if (result.entities.length > 0) {
        console.log(`get ${schemaName}: `, result.entities);
        return result.entities
      }
      window.alert(`Get string map ${schemaName} return no data`)
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
                    TextFieldList.map((t) => (
                      <TextField
                        margin="dense"
                        fullWidth
                        id={t.schemaName}
                        label={t.displayName}
                        name={t.schemaName}
                        value={this.state[t.schemaName]}
                        size="small"
                        onChange={this.onTextChange}
                        style={{ margin: 3 }}
                      />
                    ))
                  }
                  {
                    OptionList.map((o) => (
                      <Multiselect
                        id={o.schemaName}
                        placeholder={o.displayName}
                        hidePlaceholder={true}
                        options={this.state[o.schemaName]} 
                        selectedValues={this.state[`selected_${o.schemaName}`]}
                        showCheckbox={true}
                        onSelect={(list, item) => this.onSelect(`selected_${o.schemaName}`, list)} 
                        onRemove={(list, item) => this.onRemove(`selected_${o.schemaName}`, list)}
                        displayValue="value"
                        style={{ multiselectContainer: {
                          margin: 3
                        }}}
                      />
                    ))
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
                columns={TableColumns}
                data={data}
                options={{
                  exportFileName: "D365_Search_Result",
                  exportButton: true, 
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