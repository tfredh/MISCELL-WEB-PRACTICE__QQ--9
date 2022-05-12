import { Box, Tabs, Tab, Typography } from "@mui/material";
import React, { useState } from "react";
import Contacts from "./Contacts";
import Conversations from "./Conversations";

interface SidebarProps {
    id: string;
}

export default function Sidebar({ id }: SidebarProps): JSX.Element {
    const [currentPage, setValue] = useState<number>(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <React.Fragment>
            <div className="sidebar">
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <Tabs
                        className="tabs"
                        value={currentPage}
                        onChange={handleChange}
                        variant="scrollable"
                        // scrollButtons
                        allowScrollButtonsMobile
                    >
                        <Tab label="Conversations" {...a11yProps(0)} />
                        <Tab label="Contacts" {...a11yProps(1)} />
                    </Tabs>
                </Box>
                <TabPanel value={currentPage} index={0}>
                    <Conversations />
                </TabPanel>
                <TabPanel value={currentPage} index={1}>
                    <Contacts />
                    <div>
                        Lorem ipsum dolor, sit amet consectetur adipisicing
                        elit. Doloremque quos officiis numquam modi tempora,
                        exercitationem odit temporibus necessitatibus porro
                    </div>
                </TabPanel>
            </div>
        </React.Fragment>
    );
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}
