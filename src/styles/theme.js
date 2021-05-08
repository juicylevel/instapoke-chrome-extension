import { createMuiTheme } from '@material-ui/core/styles';

export default createMuiTheme({
    palette: {
        primary: {
            main: '#4317F2',
        },
    },
    overrides: {
        MuiCssBaseline: {
            '@global': {
                html: {
                    width: '800px',
                    height: '600px',
                    textRendering: 'optimizeLegibility',
                    WebkitFontSmoothing: 'antialiased',
                },
                body: {
                    width: '800px',
                    height: '600px',
                    '& #root': {
                        height: '100%',
                        minHeight: '100%',
                    },
                },
            },
        },
    },
});