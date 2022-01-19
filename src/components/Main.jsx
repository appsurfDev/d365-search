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

const theme = createTheme();

const tableColumns = [
  { title: 'Full Name', field: 'fullname' },
  { title: 'Email', field: 'emailaddress1' }
]

class Main extends React.Component {
    constructor(props) {
        super(props)
        this.onSubmit = this.onSubmit.bind(this)
        this.onReset = this.onReset.bind(this)
        this.onTextChange = this.onTextChange.bind(this)
        this.state = {
          fullname: '',
          email: '',
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
      window.Xrm.Utility.openEntityForm("contact", rowData.contactid, {openInNewWindow: true})
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

    onReset() {
      this.setState({ 
        loading: true,
        fullname: '',
        email: '',
        data: []
      })
      this.setState({ loading: false, showData: false })
    }

    onTextChange(e) {
      this.setState({
        [e.target.id]: e.target.value
      });
    }

    render() {
      const { fullname, email, data, showData, loading } = this.state
      return (
        <ThemeProvider theme={theme}>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                marginTop: 0,
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
              <Box component="form" noValidate sx={{ mt: 1 }}>
                  <Box
                    sx={{
                      marginTop: 0,
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <TextField
                      margin="dense"
                      fullWidth
                      id="fullname"
                      label="Name"
                      name="fullname"
                      value={fullname}
                      size="small"
                      onChange={this.onTextChange}
                      style={{ margin: 2 }}
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
                      style={{ margin: 2 }}
                    />
                  </Box>
                <ReactiveButton
                  buttonState={ loading ? 'loading' : 'idle' }
                  idleText="Submit"
                  onClick={this.onSubmit}
                />
                 <ReactiveButton
                  buttonState={ loading ? 'loading' : 'idle' }
                  idleText="Reset"
                  style={{margin: 10}}
                  color='secondary'
                  onClick={this.onReset}
                />
              </Box>
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
                columns={tableColumns}
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