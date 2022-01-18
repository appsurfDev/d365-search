
import React from 'react';
import MaterialTable from 'material-table';
import {
  Button,
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

class Main extends React.Component {
    constructor(props) {
        super(props)
        this.onSubmit = this.onSubmit.bind(this)
        this.onReset = this.onReset.bind(this)
        this.onTextChange = this.onTextChange.bind(this)
        this.state = {
          name: '',
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
      window.Xrm.Utility.openEntityForm("contact","12f18164-2e57-ec11-8f8f-002248587430", {openInNewWindow: true})
    }

    onSubmit() {
      console.log("Main onSubmit")
      this.setState({ loading: true, showData: false })
      this.setState({ 
        data: [{ name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63 }],
        loading: false, 
        showData: true })
    }

    onReset() {
      this.setState({ 
        loading: true,
        name: '',
        email: '',
        data: []
      })
      this.setState({ loading: false, showData: false })
    }

    onTextChange(e) {
      this.setState({
        [e.target.name]: e.target.value
      });
    }

    render() {
      const { name, email, data, showData, loading } = this.state
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
                <TextField
                  margin="dense"
                  fullWidth
                  id="name"
                  label="Name"
                  name="name"
                  value={name}
                  size="small"
                  onChange={this.onTextChange}
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
                />
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
                columns={[
                  { title: 'Name', field: 'name' },
                  { title: 'Surname', field: 'surname' },
                  { title: 'Birth Year', field: 'birthYear', type: 'numeric' },
                  { title: 'Birth City', field: 'birthCity', lookup: { 34: 'test', 63: 'test123' } }
                ]}
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