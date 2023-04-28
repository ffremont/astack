import React, { SyntheticEvent, useState } from "react";
import "./App.scss";
import { Box, Container, Tab, Tabs } from "@mui/material";
import { TabPanel } from "./components/TabPanel";
import Header from "./components/Header";
import { NewSession } from './components/NewSession/NewSession';
import { PhotoLibrary } from './components/PhotoLibrary/PhotoLibrary';

function App() {
  const [value, setValue] = useState(0);
  const [photothequeLabel, setPhotothequeLabel] = useState('Photothèque');

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };


  const handleListChange = (count: number) => {
    setPhotothequeLabel(`Photothèque (${count})`);
  }
  return (
    <Container>
      <Header/>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Nouvelle session" />
            <Tab label={photothequeLabel}/>
          </Tabs>
        </Box>
        <TabPanel value={value} index={0} children={<NewSession/>}/>
        <TabPanel value={value} index={1} children={<PhotoLibrary onListChange={handleListChange}/>}/>
      </Box>
    </Container>
  );
}

export default App;
