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



const fetchClassTitle = (classId: string) => {
  const selectedClass = classList.find((item) => item.classId === classId);
  return selectedClass ? selectedClass.title : "";
};
  /**
   * This is JUST an example of how you might fetch some data(with a different API).
   * As you might notice, this does not show up in your console right now.
   * This is because the function isn't called by anything!
   *
   * You will need to lookup how to fetch data from an API using React.js
   * Something you might want to look at is the useEffect hook.
   *
   * The useEffect hook will be useful for populating the data in the dropdown box.
   * You will want to make sure that the effect is only called once at component mount.
   *
   * You will also need to explore the use of async/await.
   *
   */
  const fetchSomeData = async () => {
    const res = await fetch("https://cat-fact.herokuapp.com/facts/", {
      method: "GET",
    });
    const json = await res.json();
    console.log(json);
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

            onChange={async (e) => {
              
            setCurrClassId(e.target.value);
            setClassTitle(fetchClassTitle(e.target.value as string));
              /* Fetching a list of students in the class */
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
    const weightedStudents = await calcAllFinalGrade(e.target.value as string);

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
