import React, { useState, useEffect } from "react";
import style from "./ServicesHist.module.css";

import { format } from "date-fns";

import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

import config from "../config/config.json";

const columns = [
  { id: "slNo", label: "Sl No" },
  { id: "service", label: "Service Name", minWidth: 200 },
  {
    id: "status",
    label: "Status",
    format: (value) => `£${value.toLocaleString("en-US")}`,
  },
];

function formatDateTime(value) {
  return format(new Date(value), "hh:MM a, dd MMM yyyy ");
}

export default function Transactions() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(15);

  const [services, setServices] = useState({});

  const [rows, setRows] = useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  function fetchAllServices() {
    fetch(`${config.apiBaseUrl}/all_services`)
      .then((resp) => resp.json())
      .then((respAll) => {
        fetch(`${config.apiBaseUrl}/services/${localStorage.getItem("userId")}`)
          .then((resp) => resp.json())
          .then((resp) => {
            const obj = {};
            respAll.forEach((item) => {
              obj[item.id] = item;
            });

            let slNo = 1;
            console.log({ obj });

            const rowss = resp.map((item) => ({
              slNo: slNo++,
              service: obj[item.service_id].service_name,
              status: 0 ? "Requested" : 1 ? "Pending" : "Completed",
            }));
            console.log({ rowss });
            setRows(rowss);
            setServices(resp);
          });
      });
  }

  function fetchServices() {}

  useEffect(() => {
    fetchServices();
    fetchAllServices();
  }, []);

  return (
    <div className={style.wrapper}>
      <h1>Services History</h1>

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.code}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === "number"
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
