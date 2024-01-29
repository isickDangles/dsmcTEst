import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';
export default function BasicTextFields() {

    const [office, setOffice] = React.useState('');
    const [program, setProgram] = React.useState('');

    const changeOffice = (event) => {
        setOffice(event.target.value);

    };
    const changeProgram = (event) => {
        setProgram(event.target.value);

    };

    return (
        <Box
            component="form"
            sx={{
                '& > :not(style)': { m: 1, width: '75ch' },
            }}
            noValidate
            autoComplete="off"
            display="flex"
            flexDirection='column'
            minHeight='100vh'
        >


            <div>


                <p class="center">
                    <TextField id="outlined-basic" label="Survey Name" variant="outlined" />
                </p>

                <p>
                <Tooltip title="Select the office this mission falls under" placement="right">
                    <FormControl fullWidth >
                        <InputLabel id="demo-simple-select-label">Office Mission</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={office}
                            label="Office Mission"
                            onChange={changeOffice}
                        >
                            <MenuItem value={10}>DSMMCX</MenuItem>
                            <MenuItem value={20}>DSPC</MenuItem>
                            <MenuItem value={30}>CELRH-PM-PD</MenuItem>
                        </Select>
                    </FormControl>
                </Tooltip>
                </p>
                <p>
                <Tooltip title="Enter the official Corps Project Name" placement="right">
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Mission, Function, Program or Project</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={program}
                            
                            label="Mission, Function, Program or Project"
                            onChange={changeProgram}
                        >
                            <MenuItem value={10}>Ex1</MenuItem>
                            <MenuItem value={20}>Ex2</MenuItem>
                            <MenuItem value={30}>Ex3</MenuItem>
                        </Select>
                    </FormControl>
                </Tooltip>
                </p>
            </div>
        </Box>
    );
}