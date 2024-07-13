/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { deletePlace, getPlaces } from "../services/firebaseService";
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
import AddPlace from "./AddEditPlace";
import { IPlace } from "../app/types";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";

const ListPlace: React.FC = () => {
  const [data, setData] = useState<IPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<IPlace>({} as IPlace);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchData = async () => {
    const formData = await getPlaces();
    setData(formData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (index: number) => {
    setSelectedPlace(data[index]);
    setOpenDialog(true);
  };

  const handleDelete = async (id: string) => {
    setDeleteId(id);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteId) {
      await deletePlace(deleteId);
      setData(data.filter((item) => item.id !== deleteId));
      setDeleteId(null);
      handleCloseDeleteDialog();
    }
  };

  const handleAddForm = () => {
    setSelectedPlace({} as IPlace);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    fetchData();
    setOpenDialog(false);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
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
                <TableCell>{item.popular ? "Active" : "Inactive"}</TableCell>
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
                    onClick={() => handleDelete(item.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Confirmation Dialog */}
        <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            Are you sure you want to delete{" "}
            <b>{data.find((item) => item.id === deleteId)?.name}</b>?
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} color="secondary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
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
        <DialogTitle>Add/Update Place</DialogTitle>
        <DialogContent>
          <AddPlace data={selectedPlace} onClosePopup={handleCloseDialog} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ListPlace;
