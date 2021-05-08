import styled from 'styled-components';
import { CssBaseline, Typography } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from 'styles/theme';

const Wrapper = styled.div`
    margin: 10px;
    padding: 10px;
    border: 1px solid #ababab;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const App = () => {
    return (
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <Wrapper>
                <Typography variant="h3">
                    Instapoke react app
                </Typography>
            </Wrapper>
        </MuiThemeProvider>
    );
};

export default App;

// https://medium.com/litslink/how-to-create-google-chrome-extension-using-react-js-5c9e343323ff