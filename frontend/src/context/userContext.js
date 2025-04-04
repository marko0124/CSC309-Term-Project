import { createContext } from "react";

export const UserContext = createContext({
    user: {
        utorid: "testUser",
        role: "regular",
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6InN1cGVydXNlciIsImlhdCI6MTc0MzcxMjUyNSwiZXhwIjoxNzQzNzk4OTI1fQ.7ntdXCP1brUBjIW5GdZHvJRTZkUYusGrc_PX76say6w",
    }
});