import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputAdornment, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { moonPhases } from "./types/moonPhases";
import { Picture } from "./types/Picture";
import { weathers } from "./types/weathers";
import { constellations } from './types/constellations';
import { pictureTypes } from "./types/pictureTypes";
import { SyntheticEvent } from 'react';

type EditPictureModalProps = {
    open: boolean,
    onClose: () => void,
    picture: Picture
}

export const EditPictureModal = ({ open, onClose, picture }: EditPictureModalProps) => {
    const handleSubmit = (e: SyntheticEvent) => {
        e.preventDefault();
        const data: any = {};
        new FormData(e.target as any).forEach((v, key) => {
            if (key === 'tags') {
                data[key] = (v as string).split(',').map(cel => cel.trim());
            } else {
                data[key] = v;
            }

        });
        fetch(`/api/pictures/${picture.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(r => {
                if (r.status > 299) {
                    throw new Error("invalid status");
                }

                onClose();
                return;
            }).catch(e => {
                alert('❌ Sauvegarde en erreur');
            });
    }

    return <Dialog open={open} onClose={onClose}>
        <DialogTitle>Edition</DialogTitle>
        <form onSubmit={handleSubmit}>
            <DialogContent>

                <DialogContentText>
                    Mise à jour de l'image <strong>{picture.id}</strong>
                </DialogContentText>

                <Select
                    defaultValue={picture.type}
                    fullWidth
                    name="type"
                    label="Type"
                >
                    {Object.keys(pictureTypes).map(key => <MenuItem key={key} value={key}>{pictureTypes[key]}</MenuItem>)}
                </Select>
                <Select
                    defaultValue={picture.moonPhase}
                    fullWidth
                    name="moonPhase"
                    label="Moon phase"
                >
                    {Object.keys(moonPhases).map(key => <MenuItem value={key} key={key}>{moonPhases[key]}</MenuItem>)}
                </Select>

                <TextField
                    autoFocus
                    margin="dense"
                    label="Name"
                    type="text"
                    name="name"
                    fullWidth
                    defaultValue={picture.name}
                    variant="filled"
                />
                <Select
                    defaultValue={picture.constellation}
                    label="Constellation"
                    name="constellation"
                    fullWidth
                >
                    {constellations.map(constellation => <MenuItem key={constellation.abr} value={constellation.abr}>{constellation.label}</MenuItem>)}
                </Select>

                <TextField
                    margin="dense"
                    label="Date"
                    type="datetime-local"
                    name="dateObs"
                    fullWidth
                    defaultValue={picture.dateObs?.substring(0, picture.dateObs.lastIndexOf(':')
                        !== -1 ? picture.dateObs.lastIndexOf(':') : undefined)}
                    variant="standard"
                />

                <TextField
                    margin="dense"
                    label="Stack Counter"
                    type="number"
                    name="stackCnt"
                    fullWidth
                    defaultValue={picture.stackCnt}
                    variant="standard"
                />

                <TextField
                    margin="dense"
                    label="Gain"
                    type="number"
                    name="gain"
                    fullWidth
                    defaultValue={picture.gain}
                    variant="standard"
                />
                <TextField
                    margin="dense"
                    label="Exposure"
                    type="number"
                    name="exposure"
                    fullWidth
                    defaultValue={picture.exposure}
                    variant="standard"
                />

                <TextField
                    margin="dense"
                    label="Tags"
                    type="text"
                    name="tags"
                    fullWidth
                    defaultValue={picture.tags?.join(", ")}
                    variant="standard"
                />


                <Select
                    defaultValue={picture.weather}
                    label="Weather"
                    name="weather"
                    fullWidth
                >
                    {Object.keys(weathers).map(key => <MenuItem key={key} value={key}>{weathers[key]}</MenuItem>)}
                </Select>

                <TextField
                    margin="dense"
                    label="Instrument"
                    type="text"
                    fullWidth
                    name="instrument"
                    defaultValue={picture.instrument}
                    variant="standard"
                />
                <TextField
                    margin="dense"
                    label="Location"
                    type="text"
                    fullWidth
                    name="location"
                    defaultValue={picture.location}
                    variant="standard"
                />
                <TextField
                    margin="dense"
                    label="Camera"
                    type="text"
                    fullWidth
                    name="camera"
                    defaultValue={picture.camera}
                    variant="standard"
                />
                <TextField
                    margin="dense"
                    label="Corrector / reductor"
                    type="text"
                    fullWidth
                    name="corrRed"
                    defaultValue={picture.corrRed}
                    variant="standard"
                />


            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button type="submit">Update</Button>
            </DialogActions>
        </form>
    </Dialog>;
}