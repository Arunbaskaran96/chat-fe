import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Chat from "./pages/chat/Chat";
import { MantineProvider, MantineThemeProvider } from "@mantine/core";
import ChatProvider from "./context/ChatProvider";

export default function App() {
  return (
    <ChatProvider>
      <MantineProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </BrowserRouter>
      </MantineProvider>
    </ChatProvider>
  );
}
