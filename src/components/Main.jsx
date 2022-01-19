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
import { SaluationOptions } from './Options.jsx'
import { TableColumns } from './TableConfig.jsx'

const theme = createTheme();

class Main extends React.Component {
    constructor(props) {
        super(props)
        this.onSubmit = this.onSubmit.bind(this)
        this.dsiplaySearch = this.dsiplaySearch.bind(this)
        this.onTextChange = this.onTextChange.bind(this)
        this.onSelect = this.onSelect.bind(this)
        this.onRemove = this.onRemove.bind(this)
        this.state = {
          // search fields
          fullname: '',
          email: '',
          selectedSalutations: [],
          // display data
          data: [],
          showData: false,
          loading: false
        }
    }

    componentDidMount() {
        console.log("Main componentDidMount")
    }

    // custom function
    onRowClick(event, rowData) {
      console.log("Main onRowClick")
      window.Xrm.Utility.openEntityForm("contact", rowData.contactid, null, {openInNewWindow: true})
    }

    dsiplaySearch() {
      this.setState({ loading:false, showData: false })
    }

    onSubmit() {
      console.log("Main onSubmit")
      var self = this
      this.setState({ loading: true, showData: false })

      const { fullname, email } = this.state

      var Entity = "contact";
      var Select = "?$select=contactid,fullname,emailaddress1";
      var Filter = `&$filter=fullname eq '${fullname}' and emailaddress1 eq '${email}'`;

      window.Xrm.WebApi.retrieveMultipleRecords(Entity, Select + Filter).then(
        function success(result) {
          console.log("result: ", result)
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

    render() {
      const { fullname, email, selectedSalutations, data, showData, loading } = this.state
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
                  
                  <TextField
                    margin="dense"
                    fullWidth
                    id="fullname"
                    label="Name"
                    name="fullname"
                    value={fullname}
                    size="small"
                    onChange={this.onTextChange}
                    style={{ margin: 3 }}
                  />
                  <TextField
                    margin="dense"
                    fullWidth
                    name="email"
                    label="Email"
                    id="email"
                    value={email}
                    size="small"
                    onChange={this.onTextChange}
                    style={{ margin: 3 }}
                  />
                  <Multiselect
                    id='selectedSalutations'
                    placeholder="Salutations"
                    hidePlaceholder={true}
                    options={SaluationOptions} 
                    selectedValues={selectedSalutations}
                    showCheckbox={true}
                    onSelect={(list, item) => this.onSelect('selectedSalutations', list)} 
                    onRemove={(list, item) => this.onRemove('selectedSalutations', list)}
                    displayValue="name"
                    style={{ multiselectContainer: {
                      margin: 3
                    }}}
                  />
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