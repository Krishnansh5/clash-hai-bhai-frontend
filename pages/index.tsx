import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { DataGrid,GridColDef } from '@mui/x-data-grid';
import { Button,Card, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, Typography} from '@mui/material';
import allTemplates from '../public/template.json'
import { useState } from 'react';

interface semTemplate {
  "1":string[];
  "2":string[];
  "3":string[];
  "4":string[];
  "5":string[];
  "6":string[];
  "7":string[];
  "8":string[];
}

interface course {
  course: string;
}

const getAllAvailableCourses = async (branch: string,sem: number) => {
  const requestParams: {branch: string; sem: number;} = { //change according to backend functions
    branch: branch,
    sem: sem
  };
  const response = await fetch("",{ // request URL to be determined by backend 
    method:"POST",
    body: JSON.stringify(requestParams)
  });
  return response; // Check type accoring to backend (Probably: string[])
}

const checkCourseClash = async (courseReq: string,currTemplate: string[]) => {
  const requestParams: {courseReq: string; currTemplate: string[];} = { //change according to backend functions
    courseReq: courseReq,
    currTemplate: currTemplate
  };
  const response = await fetch("",{ // request URL to be determined by backend 
    method:"POST",
    body: JSON.stringify(requestParams)
  });
  return response; // Check type accoring to backend (Probably: boolean)
}

const dummyAvailableCourses = ["PE101","PE102","PE103","PE104"];

const semesters = ["1","2","3","4","5","6","7","8"];

export default function Home() {
  const allBranches: string[] = Object.keys(allTemplates);
  const [allSemTemplates,setAllSemTemplates] = useState<semTemplate>({} as semTemplate);
  const [branch, setBranch] = useState<string>("");
  const [sem, setSem] = useState<string>("");
  const [template,setTemplate] = useState<string[]>([]);

  const handleChangeBranch = (event: SelectChangeEvent) => {
    setBranch(event.target.value as string);
    for (const key in allTemplates){
      if(key === event.target.value){
        setAllSemTemplates(allTemplates[key as keyof typeof allTemplates]);
      }
    }
  };

  const handleChangeSem = (event: SelectChangeEvent) => {
    setSem(event.target.value as string);
    for (const key in allSemTemplates){
      if(key === event.target.value){
        setTemplate(allSemTemplates[key as keyof typeof allSemTemplates]);
        // Add a request to check available courses by calling getAllAvailableCourses
        // Or maybe we are going to store the available courses in JSON file ?? then no need for getAllAvailableCourses
      }
    }
  };

  const handleCourseDrop = (dropCourse: string) => {
    setTemplate(template.filter((value) => (value !== dropCourse)));
  }

  const handleCourseAdd = (addCourse: string) => {
    console.log("adding course");
    // request backend to check for timing clash by calling the checkCourseClash function
    // then accordingly append course into template and remove it from availableCourses
  }

  const template_cols: GridColDef[] = [
    {
      field: 'course',
      headerName: 'Course'
    },
    {
      field: "options",
      headerName: "",
      renderCell: (params) => (
        <Button 
          variant="outlined" 
          color="error" 
          onClick={() => {
              handleCourseDrop(params.row.course)
            }}>
          Drop
        </Button>
      )
    }
  ]

  const courses_cols: GridColDef[] = [
    {
      field: 'course',
      headerName: 'Course'
    },
    {
      field: "options",
      headerName: "",
      renderCell: (params) => (
        <Button 
          variant="outlined" 
          color="success" 
          onClick={() => {
              handleCourseAdd(params.row.course)
            }}>
          Add
        </Button>
      )
    }
  ]

  return (
    <div>
      <Head>
        <title>Clash Hai Bhai!</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Stack spacing={4} alignItems="center">
        <Typography variant="h3" align="center" gutterBottom>
          Clash Hai Bhai!
        </Typography>
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={{ xs: 1, sm: 2, md: 4 }}
          justifyContent = "center"
          >
          <Stack>
            <InputLabel id="branch-select">Select Branch</InputLabel>
            <Select
              labelId = "branch-select"
              id="branch-select"
              value={branch}
              label="Select Branch"
              onChange={handleChangeBranch}
            >
              {
                (allBranches.map((branch,index) => {
                  return (<MenuItem key={index} value={branch}>{branch}</MenuItem>)
                }))
              }
            </Select>
          </Stack>
          <Stack>
            <InputLabel id="sem-select">Select Semester</InputLabel>
            <Select
              labelId = "sem-select"
              id="sem-select"
              value={sem}
              label="Select Semester"
              onChange={handleChangeSem}
            >
              {
                (branch!=="" && (semesters.map((sem,index) => {
                  return (<MenuItem key={index} value={sem}>{sem}</MenuItem>)
                })))
              }
            </Select>
          </Stack>
        </Stack>
        <Card
          elevation={5}
          sx={{
            padding: 5,
            width: {
              md: "800px",
              xs: "100%",
            },
          }}
        >
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Stack>
                <Typography>Your Template</Typography>
                <DataGrid columns={template_cols} rows={template.map((value) => ({course: value} as course))} getRowId = {(row) => row.course} autoHeight sx={{maxHeight: 500}}/>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack>
                <Typography>Available courses</Typography>
                <DataGrid columns={courses_cols} rows={dummyAvailableCourses.map((value) => ({course: value} as course))} getRowId = {(row) => row.course} autoHeight sx={{maxHeight: 500}}/>
              </Stack>
            </Grid>
          </Grid>
        </Card>
      </Stack>
    </div>
  );
}
