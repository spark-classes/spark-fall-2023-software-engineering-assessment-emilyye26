import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import { Select, Typography, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from "@mui/material";
/**
 * You will find globals from this file useful!
 */
import {BASE_API_URL, TOKEN, MY_BU_ID} from "./globals";
import { IUniversityClass, IStudent } from "./types/api_types";
import { calcAllFinalGrade, calculateStudentFinalGrade } from "./utils/calculate_grade";

function App() {
  // You will need to use more of these!
  const [currClassId, setCurrClassId] = useState<string>("");
  const [currClassTitle, setClassTitle] = useState<string>("");
  const [classList, setClassList] = useState<IUniversityClass[]>([]);
  const [studentList, setStudents] = useState<IStudent[]>([]);
  const [weightGrades, setWeightGrades] = useState<[]>([]);

  // Retrieves class information from the API and sets ClassList
  useEffect(() => {
    const fetchClasses = async() => {
      const response = await fetch("https://spark-se-assessment-api.azurewebsites.net/api/class/listBySemester/fall2022?buid=1435265", {
        method: "GET",
        headers: {
          "x-functions-key": TOKEN,
          "Accept": "application/json",
        },
      });

      const result = await response.json();
      setClassList(result);
  };   
  fetchClasses();
}, []);

// function to fetch the class title when given the class id
const fetchClassTitle = (classId: string) => {
  const selectedClass = classList.find((item) => item.classId === classId);
  return selectedClass ? selectedClass.title : "";
};

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Grid container spacing={2} style={{ padding: "1rem" }}>
        <Grid xs={12} container alignItems="center" justifyContent="center">
          <Typography variant="h2" gutterBottom>
            Spark Assessment
          </Typography>
        </Grid>
        <Grid xs={12} md={4}>
          <Typography variant="h4" gutterBottom>
            Select a class
          </Typography>
          <div style={{ width: "100%" }}>
          
          <Select 
            fullWidth={true} 
            label="Class"
            value={currClassId} 
            // Upon selecting an option
            onChange={async (e) => {
              // sets class id and title based on selected value
              setCurrClassId(e.target.value);
              setClassTitle(fetchClassTitle(e.target.value as string));
              // Fetching a list of students in the class 
              console.log(e.target.value);
              const response = await fetch(`https://spark-se-assessment-api.azurewebsites.net/api/class/listStudents/${e.target.value}?buid=1435265`, {
              method: "GET",
              headers: {
                "x-functions-key": TOKEN,
                "Accept": "application/json",
            },
          });
            const Ids = await response.json();
            console.log(Ids);

            const studentData = [];
            for (const Id of Ids) {
              const studentInfo = await fetch(`https://spark-se-assessment-api.azurewebsites.net/api/student/GetById/${Id}?buid=1435265`, {
                method: "GET",
                headers: {
                  "x-functions-key": TOKEN,
                  "Accept": "application/json",
                },
              });

                const result = await studentInfo.json();
                studentData.push(result); 
            }
            const weightedStudents = await calcAllFinalGrade(e.target.value as string);
  const flatStudentData = studentData.map((student, index) => ({
    ...student,
    weightedSum: weightedStudents[index].weightedSum,
    name: weightedStudents[index].name,
    universityId: weightedStudents[index].studentId
  }));
  setStudents(flatStudentData);
  }}
>
  {
    classList.map((item) => (
      <MenuItem key={item.title} value={item.classId}>
        {item.title}
      </MenuItem>
    ))
  }


</Select>

          </div>
        </Grid>
        <Grid xs={12} md={8}>
          <Typography variant="h4" gutterBottom>
            Final Grades
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student ID</TableCell>
                  <TableCell>Student Name</TableCell>
                  <TableCell>Class ID</TableCell>
                  <TableCell>Class Name</TableCell>
                  <TableCell>Semester</TableCell>
                  <TableCell>Final Grade</TableCell>
                </TableRow>

              </TableHead>
              <TableBody>
              {studentList.map((student) => (
                <TableRow key={student.universityId}>
                  <TableCell>{student.universityId}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{currClassId}</TableCell>
                  <TableCell>{currClassTitle}</TableCell>
                  <TableCell>Fall 2022</TableCell>
                  <TableCell>{student.weightedSum}</TableCell>
    </TableRow>
  ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <div>
            
          </div>
          
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
