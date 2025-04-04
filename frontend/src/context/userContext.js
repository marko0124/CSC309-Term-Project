import { createContext } from "react";

export const UserContext = createContext({
    utorid: "testUser",
    role: "manager",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6InN1cGVydXNlciIsImlhdCI6MTc0Mzc1MzcxNywiZXhwIjoxNzQzODQwMTE3fQ.CskrdygVMRWH_VtVRcJomJTBCYF8jOXYsvGCITBE5ek"
});