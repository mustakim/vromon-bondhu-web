/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { getPlaces } from "../services/firebaseService";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import AddPlace from "./AddPlace";
import { IPlace } from "../app/types";
import Button from "@mui/material/Button";

const ListPlace: React.FC = () => {
  const [data, setData] = useState<IPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const formData = await getPlaces();
      setData(formData);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleEdit = (index: number) => {
    // Implement edit functionality here
    console.log("Edit clicked for index:", index);
  };

  const handleDelete = (index: number) => {
    // Implement delete functionality here
    console.log("Delete clicked for index:", index);
  };


  const handleAddForm = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ marginTop: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Place List
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Images</TableCell>
              <TableCell>Latitude</TableCell>
              <TableCell>Longitude</TableCell>
              <TableCell>Popular</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.name}</TableCell>
                <TableCell>
                  {item?.image?.map((imageUrl, imgIndex) => (
                    <>
                      <img
                        key={imgIndex}
                        src={imageUrl}
                        alt={`Image ${imgIndex}`}
                        style={{
                          width: 100,
                          objectFit: "cover",
                          marginRight: 5,
                        }}
                      />
                      <br />
                    </>
                  ))}
                </TableCell>
                <TableCell>{item.latitude}</TableCell>
                <TableCell>{item.longitude}</TableCell>
                <TableCell>{item.popular ? "Yes" : "No"}</TableCell>
                <TableCell>{item.rating}</TableCell>
                <TableCell>
                  <Typography
                    sx={{
                      fontSize: "0.875rem",
                      fontWeight: 400,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      width: "280px",
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 2,
                    }}
                  >
                    {item.description}
                  </Typography>
                </TableCell>
                <TableCell>
                  <IconButton
                    aria-label="edit"
                    onClick={() => handleEdit(index)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleDelete(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        onClick={handleAddForm}
      >
        <AddIcon />
      </Fab>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add Place</DialogTitle>
        <DialogContent>
          <AddPlace />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ListPlace;
