/**
 * This file contains some function stubs(ie incomplete functions) that
 * you MUST use to begin the work for calculating the grades.
 *
 * You may need more functions than are currently here...we highly encourage you to define more.
 *
 * Anything that has a type of "undefined" you will need to replace with something.
 */
import { IUniversityClass } from "../types/api_types";

/**
 * This function might help you write the function below.
 * It retrieves the final grade for a single student based on the passed params.
 * 
 * If you are reading here and you haven't read the top of the file...go back.
 */
export async function calculateStudentFinalGrade(
  studentID: string,
  classAssignments: undefined,
  klass: IUniversityClass
): Promise<undefined> {
  return undefined;
}

/**
 * You need to write this function! You might want to write more functions to make the code easier to read as well.
 * 
 *  If you are reading here and you haven't read the top of the file...go back.
 * 
 * @param classID The ID of the class for which we want to calculate the final grades
 * @returns Some data structure that has a list of each student and their final grade.
 */
export async function calcAllFinalGrade(classID: string): Promise<undefined> {
  const response = await fetch(
    `https://spark-se-assessment-api.azurewebsites.net/api/class/listStudents/${classID}?buid=1435265`, {
            method: "GET",
            headers: {
            "x-functions-key":
            "6se7z2q8WGtkxBlXp_YpU-oPq53Av-y_GSYiKyS_COn6AzFuTjj4BQ==",
            "Accept": "application/json",
          },
    });
    const Ids = await response.json();
    console.log(Ids);

    const studentData = [];
    for (const Id of Ids) {
      const studentInfo = await fetch(`https://spark-se-assessment-api.azurewebsites.net/api/student/listGrades/${Id}/${classID}/?buid=1435265`, {
        method: "GET",
        headers: {
          "x-functions-key": "6se7z2q8WGtkxBlXp_YpU-oPq53Av-y_GSYiKyS_COn6AzFuTjj4BQ==",
          "Accept": "application/json",
        },
      });
      const result = await studentInfo.json();
      const grades = result.grades[0];
      const gradeValues = Object.values(grades) as number[];
    
      const totalGrade = gradeValues.reduce((total, grade) => total + Number(grade), 0);
      
      console.log(gradeValues[0]);

      
      studentData.push(result);
    }

    
    // console.log(studentData);
    // studentData.map((item) => (
    //   console.log(item.grades.A1)
    // ))

  return undefined;
}
