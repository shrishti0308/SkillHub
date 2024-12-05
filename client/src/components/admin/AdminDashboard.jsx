import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Security as SecurityIcon,
} from "@mui/icons-material";
import {
  fetchAllAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  updatePermissions,
  clearSuccess,
  clearError,
  getCurrentAdmin,
} from "../../redux/slices/adminSlice";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const {
    admins = [],
    loading,
    error,
    success,
    currentAdmin,
  } = useSelector((state) => state.admin);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
  });
  const [formErrors, setFormErrors] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);
  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [permissionsAdmin, setPermissionsAdmin] = useState(null);

  const availablePermissions = [
    "manageUsers",
    "manageJobs",
    "manageBids",
    "manageTransactions",
    "viewReports",
    "manageAdmins",
    "manageSettings",
  ];

  const [userStats, setUserStats] = useState({});
  const [jobStats, setJobStats] = useState({});
  const [monthlyStats, setMonthlyStats] = useState([]);

  useEffect(() => {
    // Fetch current admin data if not present
    if (!currentAdmin) {
      dispatch(getCurrentAdmin());
    }
    console.log("currentAdmin", currentAdmin);
    dispatch(fetchAllAdmins());
  }, [dispatch, currentAdmin]);

  useEffect(() => {
    if (success) {
      setOpenDialog(false);
      setSelectedAdmin(null);
      setFormData({ name: "", email: "", password: "", role: "admin" });
      dispatch(clearSuccess());
    }
  }, [success, dispatch]);

  useEffect(() => {
    if (admins) {
      const roleStats = admins.reduce((acc, admin) => {
        acc[admin.role] = (acc[admin.role] || 0) + 1;
        return acc;
      }, {});
      setUserStats(roleStats);
    }
  }, [admins]);

  useEffect(() => {
    if (admins) {
      const statusStats = admins.reduce((acc, admin) => {
        acc[admin.status] = (acc[admin.status] || 0) + 1;
        return acc;
      }, {});

      const monthlyData = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        return {
          name: date.toLocaleString('default', { month: 'short' }),
          admins: admins.filter(admin => {
            const adminDate = new Date(admin.createdAt);
            return adminDate.getMonth() === date.getMonth() &&
                   adminDate.getFullYear() === date.getFullYear();
          }).length,
        };
      }).reverse();

      setJobStats(statusStats);
      setMonthlyStats(monthlyData);
    }
  }, [admins]);

  const userRoleData = Object.entries(userStats).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }));

  const jobStatusData = Object.entries(jobStats).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }));

  const handleOpenDialog = (admin = null) => {
    if (admin) {
      setFormData({
        name: admin.name,
        email: admin.email,
        password: "",
        role: admin.role,
      });
      setSelectedAdmin(admin);
    } else {
      setFormData({ name: "", email: "", password: "", role: "admin" });
      setSelectedAdmin(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAdmin(null);
    setFormData({ name: "", email: "", password: "", role: "admin" });
    dispatch(clearError());
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.email = "Invalid email format";
    }
    if (!selectedAdmin && !formData.password) {
      errors.password = "Password is required for new admin";
    }
    if (formData.password && formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    formData.role = "admin";

    const submitData = { ...formData };
    if (selectedAdmin && !submitData.password) {
      delete submitData.password; // Don't send empty password on update
    }

    try {
      if (selectedAdmin) {
        await dispatch(
          updateAdmin({
            id: selectedAdmin._id,
            data: submitData,
          })
        ).unwrap();
      } else {
        await dispatch(createAdmin(submitData)).unwrap();
      }
      handleCloseDialog();
    } catch (error) {
      // Error will be handled by Redux
    }
  };

  const handleDeleteClick = (admin) => {
    // Prevent self-deletion
    if (currentAdmin?.id === admin._id) {
      dispatch({
        type: "admin/setError",
        payload: "You cannot delete your own account",
      });
      return;
    }

    // Prevent deletion of last superuser
    if (admin.role === "superuser") {
      const superuserCount = admins.filter(
        (a) => a.role === "superuser"
      ).length;
      if (superuserCount <= 1) {
        dispatch({
          type: "admin/setError",
          payload: "Cannot delete the last superuser account",
        });
        return;
      }
    }

    setAdminToDelete(admin);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    await dispatch(deleteAdmin(adminToDelete._id));
    setDeleteDialogOpen(false);
    setAdminToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setAdminToDelete(null);
  };

  const handleOpenPermissionsDialog = (admin) => {
    setPermissionsAdmin(admin);
    setSelectedPermissions(admin.permissions || []);
    setPermissionsDialogOpen(true);
  };

  const handleClosePermissionsDialog = () => {
    setPermissionsDialogOpen(false);
    setPermissionsAdmin(null);
    setSelectedPermissions([]);
  };

  const handlePermissionChange = (permission) => {
    setSelectedPermissions((prev) => {
      if (prev.includes(permission)) {
        return prev.filter((p) => p !== permission);
      } else {
        return [...prev, permission];
      }
    });
  };

  const handleSavePermissions = async () => {
    if (permissionsAdmin) {
      await dispatch(
        updatePermissions({
          id: permissionsAdmin._id,
          permissions: selectedPermissions,
        })
      );
      dispatch(fetchAllAdmins());
      handleClosePermissionsDialog();
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            Manage Admins
          </Typography>
          {(currentAdmin?.role === "superuser" ||
            currentAdmin?.permissions.includes("manageAdmins")) && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleOpenDialog()}
            >
              Add New Admin
            </Button>
          )}
        </Box>

        <Grid container spacing={2}>
          {/* Monthly Growth Chart */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2, backgroundColor: '#1a237e' }}>
              <Typography variant="h6" gutterBottom color="white">
                Monthly Growth
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" stroke="white" />
                  <YAxis stroke="white" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="admins" stroke="#8884d8" name="Admins" />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* User Distribution Chart */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, backgroundColor: '#1a237e' }}>
              <Typography variant="h6" gutterBottom color="white">
                User Role Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={userRoleData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {userRoleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Job Status Chart */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, backgroundColor: '#1a237e' }}>
              <Typography variant="h6" gutterBottom color="white">
                Job Status Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={jobStatusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" stroke="white" />
                  <YAxis stroke="white" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8">
                    {jobStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {admins.map((admin) => (
                    <TableRow key={admin._id}>
                      <TableCell>{admin.name}</TableCell>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell>{admin.role}</TableCell>
                      <TableCell align="right">
                        {admin.role !== "superuser" && (
                          <>
                            <IconButton
                              onClick={() => handleOpenPermissionsDialog(admin)}
                              color="primary"
                              disabled={currentAdmin?.id === admin._id}
                            >
                              <SecurityIcon />
                            </IconButton>
                            <IconButton
                              onClick={() => handleDeleteClick(admin)}
                              color="error"
                              disabled={currentAdmin?.id === admin._id}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </>
                        )}
                        <IconButton
                          onClick={() => handleOpenDialog(admin)}
                          color="primary"
                          disabled={
                            !currentAdmin?.permissions.includes("manageAdmins") ||
                            (admin.role === "superuser" &&
                              currentAdmin?.role !== "superuser")
                          }
                        >
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>

        {/* Add New Admin Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          <form onSubmit={handleSubmit}>
            <DialogTitle>
              {selectedAdmin ? "Edit Admin" : "Add New Admin"}
            </DialogTitle>
            <DialogContent>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
              >
                <TextField
                  name="name"
                  label="Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  error={!!formErrors.name}
                  helperText={formErrors.name}
                  fullWidth
                  required
                />
                <TextField
                  name="email"
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={!!formErrors.email}
                  helperText={formErrors.email}
                  fullWidth
                  required
                />
                <TextField
                  name="password"
                  label={selectedAdmin ? "New Password (optional)" : "Password"}
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  error={!!formErrors.password}
                  helperText={formErrors.password}
                  fullWidth
                  required={!selectedAdmin}
                />
              </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button type="submit" variant="contained" color="primary">
                {selectedAdmin ? "Update" : "Create"}
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete admin: {adminToDelete?.name}? This
              action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel}>Cancel</Button>
            <Button
              onClick={handleDeleteConfirm}
              color="error"
              variant="contained"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Permissions Dialog */}
        <Dialog
          open={permissionsDialogOpen}
          onClose={handleClosePermissionsDialog}
        >
          <DialogTitle>
            Manage Permissions for {permissionsAdmin?.name}
          </DialogTitle>
          <DialogContent>
            <FormGroup>
              {availablePermissions.map((permission) => (
                <FormControlLabel
                  key={permission}
                  control={
                    <Checkbox
                      checked={selectedPermissions.includes(permission)}
                      onChange={() => handlePermissionChange(permission)}
                    />
                  }
                  label={permission}
                />
              ))}
            </FormGroup>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClosePermissionsDialog}>Cancel</Button>
            <Button
              onClick={handleSavePermissions}
              variant="contained"
              color="primary"
            >
              Save Permissions
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default AdminDashboard;
