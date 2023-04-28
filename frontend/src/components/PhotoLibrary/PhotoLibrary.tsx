import { Autocomplete, Box, Grid, TextField } from '@mui/material'
import { useEffect, useState } from 'react';
import { SyntheticEvent } from 'react';

type PhotoLibraryProps = {
    onListChange: (count: number) => void
}

type Picture = {
    id: string,
    moonPhase: string,
    weather: string,
    instrument: string,
    location: string,
    camera: string,
    corrRed: string,
    exposure: string,
    gain:number,
    stackCnt: number,
    constellation: string,
    novaAstrometryReportUrl:string
}

export const PhotoLibrary = ({ onListChange }: PhotoLibraryProps) => {
    const [tags, setTags] = useState<string[]>([]);
    const [pictures, setPictures] = useState<Picture[]>([]);

    useEffect(() => {
       
    }, [])

    useEffect(() => {
        fetch('/api/pictures/tags')
        .then(r => r.json())
        .then(t => setTags(t))

        fetch('/api/pictures')
        .then(r => r.json())
        .then(p => setPictures(p))
    }, []);

    const handleTagChange = (e : SyntheticEvent)=>{
        console.log(e.currentTarget);
    }
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Autocomplete
                        multiple
                        id="tags-standard"
                        options={tags}
                        getOptionLabel={(option) => option}
                        onChange={handleTagChange}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="standard"
                                label="Tags"
                                placeholder="M54"
                            />
                        )}
                    />
                </Grid>
            </Grid>
        </Box>
    )
}
