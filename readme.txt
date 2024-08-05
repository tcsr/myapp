
import { Box, CircularProgress, Typography, Backdrop } from '@mui/material';

const LoadingOverlay = ({ loadingText = "Loading..." }) => {
    return (
        <Backdrop open={true} style={{ zIndex: 9999 }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    padding: '20px',
                    borderRadius: '8px',
                }}
            >
                <CircularProgress color="primary" />
                <Typography variant="h6" style={{ marginTop: '10px' }}>
                    {loadingText}
                </Typography>
            </Box>
        </Backdrop>
    );
};

export default LoadingOverlay;
