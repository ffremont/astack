import {
    Autocomplete,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia,
    Collapse,
    Grid,
    IconButton,
    IconButtonProps,
    styled,
    TextField,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { SyntheticEvent } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import SearchIcon from '@mui/icons-material/Search'
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline'
import MmsIcon from '@mui/icons-material/Mms'
import { constellations } from '../types/constellations'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit';
import { weathers } from '../types/weathers'
import { moonPhases } from '../types/moonPhases'
import { pictureTypes } from '../types/pictureTypes'
import { EditPictureModal } from '../EditPictureModal'
import { Picture } from '../types/Picture'

type PhotoLibraryProps = {
    onListChange: (count: number) => void
}

type WebTag = {
    label: string,
    value: string
}



interface ExpandMoreProps extends IconButtonProps {
    expand: boolean
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props
    return <IconButton {...other} />
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}))

export const PhotoLibrary = ({ onListChange }: PhotoLibraryProps) => {
    const [editPicture, setEditPicture] = useState<Picture | null>(null);
    const [selectedTags, setSelectedTags] = useState<WebTag[]>([])
    const [tags, setTags] = useState<WebTag[]>([])
    const [pictures, setPictures] = useState<Picture[]>([{
        "id": "a38583c6-75d3-4785-a9a5-e2f95e4dcf6b",
        "name": "NGC7023",
        "moonPhase": "LAST_QUARTER",
        "dateObs": "2023-08-07T13:21:02",
        "weather": "VERY_GOOD",
        "instrument": "SW 250 / 1200",
        "location": "maison",
        "camera": "ZWO ASI294MM Pro",
        "corrRed": "Nexus Starizona x0.75",
        "exposure": 4.0,
        "gain": 120,
        "stackCnt": 231,
        "tags": [
            "NGC7023"
        ],
        "constellation": "Cep",
        "novaAstrometryReportUrl": "https://nova.astrometry.net/user_images/8400212",

        "type": "NEBULAR",
        "webTags": [
            "NGC7023",
            "maison",
            "VERY_GOOD",
            "LAST_QUARTER",
            "Cep"
        ]
    }])

    const refreshPictures = () => {
        fetch('/api/pictures')
            .then((r) => r.json())
            .then((p) => setPictures(p))
    }

    useEffect(() => {
        fetch('/api/pictures/tags')
            .then((r) => r.json())
            .then((t) => setTags(t))

        refreshPictures()
    }, []);

    useEffect(() => {
        onListChange(pictures.length);
    }, [pictures]);

    const [expanded, setExpanded] = useState<string | null>(null)

    const handleExpandClick = (id: string) => {
        if (expanded) {
            setExpanded(null)
        } else {
            setExpanded(id)
        }
    }

    const handleTagChange = (e: SyntheticEvent, values: WebTag[] | null) => {
        setExpanded(null)
        setSelectedTags(values || [])
    }

    const handleDelete = (id: any) => {
        if (!window.confirm(`Confirmez-vous la suppression de ${id} ?`)) {
            return
        }

        fetch(`/api/pictures/${id}`, {
            method: 'DELETE',
        }).then((r) => {
            refreshPictures()

            if (r.status === 200) alert('Suppression avec succès')
            else alert('Oups un problème est survenue lors de la suppression')
        })
    }

    let formatExpo = (picture: Picture) => {
        const expo = (picture.exposure || 0) * (picture.stackCnt || 0);
        if (expo > 60) {
            return `${Math.floor(expo / 60)}m ${expo % 60}s`;
        } else {
            return `${expo}s`
        }
    };

    const handleOnCloseEditPictureModal = () => {
        setEditPicture(null);

        // todo refresh
        refreshPictures();
    };
    return (
        <>
            <EditPictureModal open={editPicture !== null} picture={editPicture || {}} onClose={handleOnCloseEditPictureModal} />

            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Autocomplete
                            multiple
                            id="tags-standard"
                            limitTags={3}
                            options={tags}
                            getOptionLabel={(option) => option.label}
                            onChange={handleTagChange}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="standard"
                                    label="Tags"
                                    placeholder="Saisir une cible / lunaison / météo / constellation "
                                />
                            )}
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={2} marginTop={1}>
                    {pictures
                        .filter(
                            (p) =>
                                selectedTags.map((wt: WebTag) => wt.value).filter((x) =>
                                    (p.webTags || []).includes(x)
                                ).length === selectedTags.length
                        )
                        .map((picture) => (
                            <Grid item xs={6} key={picture.id}>
                                {' '}
                                <Card>
                                    <CardHeader
                                        action={
                                            <IconButton
                                                href={`/api/pictures/images/${picture.id}`}
                                                target="_blank"
                                                aria-label="voir"
                                            >
                                                <SearchIcon />
                                            </IconButton>
                                        }
                                        title={`${picture.type
                                            ? pictureTypes[picture.type] + ' : '
                                            : 'Type inconnu '
                                            }${picture.name
                                                ? picture.name
                                                : 'cible introuvé'
                                            } ${picture.constellation
                                                ? '(' +
                                                constellations.find(
                                                    (c) =>
                                                        c.abr ===
                                                        picture.constellation
                                                )?.label +
                                                ')'
                                                : ''
                                            }`}
                                        subheader={`${new Intl.DateTimeFormat(
                                            'fr-FR',
                                            {
                                                dateStyle: 'medium',
                                                timeStyle: 'short',
                                                timeZone: 'Europe/Paris',
                                            }
                                        ).format(
                                            new Date(picture.dateObs || new Date())
                                        )} à ${picture.location}`}
                                    />
                                    <CardMedia
                                        component="img"
                                        height="194"
                                        image={`/api/pictures/thumbs/${picture.id}`}
                                        alt=""
                                    />
                                    <CardContent>
                                        {picture.tags?.map((tag) => (
                                            <Button
                                                key={tag}
                                                href={`https://theskylive.com/sky/deepsky/${tag.toLowerCase()}-object`}
                                                target="_blank"
                                                sx={{ margin: 0.5 }}
                                                variant="contained"
                                                className="app-target"
                                            >
                                                {tag
                                                    .replace('NGC', 'NGC ')
                                                    .replace('IC', 'IC ')
                                                    .replace('M', 'M ')}
                                            </Button>
                                        ))}

                                        <ul>
                                            <li>
                                                <strong>
                                                    Exposition : {formatExpo(picture)} ({picture.exposure}s
                                                    x {picture.stackCnt})
                                                </strong>
                                            </li>
                                            <li>Camera : {picture.camera}</li>
                                        </ul>
                                    </CardContent>
                                    <CardActions disableSpacing>
                                        <Button
                                            color={'secondary'}
                                            target="_blank"
                                            href={`/api/pictures/annotated/${picture.id}`}
                                            startIcon={<MmsIcon />}
                                        >
                                            Annotation
                                        </Button>
                                        <Button
                                            download={picture.id + '.fit'}
                                            href={`/api/pictures/raws/${picture.id}`}
                                            startIcon={<DownloadForOfflineIcon />}
                                        >
                                            Source
                                        </Button>
                                        <Button
                                            onClick={() => handleDelete(picture.id)}
                                            startIcon={<DeleteIcon />}
                                        >
                                            Effacer
                                        </Button>
                                        <Button
                                            onClick={() => setEditPicture(picture)}
                                            startIcon={<EditIcon />}
                                        >
                                            Editer
                                        </Button>

                                        <ExpandMore
                                            expand={expanded === picture.id}
                                            onClick={() =>
                                                handleExpandClick(
                                                    picture.id as string
                                                )
                                            }
                                            aria-expanded={expanded === picture.id}
                                            aria-label="show more"
                                        >
                                            <ExpandMoreIcon />
                                        </ExpandMore>
                                    </CardActions>
                                    <Collapse
                                        in={expanded === picture.id}
                                        timeout="auto"
                                        unmountOnExit
                                    >
                                        <CardContent>
                                            <ul>
                                                {picture.constellation && (
                                                    <li>
                                                        Constellation :{' '}
                                                        {
                                                            constellations.find(
                                                                (c) =>
                                                                    c.abr ===
                                                                    picture.constellation
                                                            )?.label
                                                        }
                                                    </li>
                                                )}
                                                {picture.moonPhase && (
                                                    <li>
                                                        {
                                                            moonPhases[
                                                            picture.moonPhase
                                                            ]
                                                        }{' '}
                                                    </li>
                                                )}
                                                <li>{picture.instrument}</li>
                                                <li>{picture.corrRed}</li>
                                                {picture.weather && (
                                                    <li>
                                                        Météo :{' '}
                                                        {weathers[picture.weather]}
                                                    </li>
                                                )}
                                                <li>Id: {picture.id}</li>
                                            </ul>
                                        </CardContent>
                                    </Collapse>
                                </Card>
                            </Grid>
                        ))}
                </Grid>
            </Box></>
    )
}
