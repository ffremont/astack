import { Typography } from '@mui/material'

type LoaderProps = {
    message?: string
}

export const Loader = ({ message = 'Chargement...' }: LoaderProps) => (
    <div className="loader">
        <div className="lds-ripple">
            <div></div>
            <div></div>
        </div>
        <Typography variant="body1" gutterBottom sx={{ textAlign: 'center' }}>
            {message}
        </Typography>
    </div>
)
