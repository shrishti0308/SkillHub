import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  Chip,
  Card,
  CardContent,
  InputAdornment,
  Tooltip,
  CircularProgress,
  useTheme,
  alpha,
  Divider,
  Avatar,
  Select,
  FormControl,
  InputLabel,
  Pagination,
} from "@mui/material";
import {
  Delete,
  Edit,
  Search,
  Refresh,
  PersonAdd,
  VerifiedUser,
} from "@mui/icons-material";
import {
  fetchUsers,
  deleteUser,
  updateUser,
} from "../../redux/slices/adminUsersSlice";

const USER_ROLES = ["freelancer", "enterprise", "hybrid"];

const AdminUsers = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.adminUsers);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [editFormData, setEditFormData] = useState({
    name: "",
    username: "",
    email: "",
    role: "",
    commissionRate: 0,
    bio: "",
    info: {
      skills: "",
      portfolio: "",
      experience: "",
    },
  });

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (users) {
      let filtered = [...users];

      // Apply search filter
      if (searchQuery) {
        filtered = filtered.filter(
          (user) =>
            user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.username?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Apply role filter
      if (roleFilter !== "all") {
        filtered = filtered.filter((user) => user.role === roleFilter);
      }

      setFilteredUsers(filtered);
      setPage(1); // Reset to first page when filters change
    }
  }, [users, searchQuery, roleFilter]);

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setEditFormData({
      name: user.name || "",
      username: user.username || "",
      email: user.email || "",
      role: user.role || "",
      commissionRate: user.commissionRate || 0,
      bio: user.bio || "",
      info: {
        skills: user.info?.skills?.join(", ") || "",
        portfolio: user.info?.portfolio || "",
        experience: user.info?.experience?.join(", ") || "",
      },
    });
    setOpenEditDialog(true);
  };

  const handleEditSubmit = async () => {
    const updates = {
      ...editFormData,
      info: {
        ...editFormData.info,
        skills: editFormData.info.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
        experience: editFormData.info.experience
          .split(",")
          .map((exp) => exp.trim())
          .filter(Boolean),
      },
    };

    await dispatch(updateUser({ userId: selectedUser._id, updates }));
    setOpenEditDialog(false);
    setSelectedUser(null);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (selectedUser) {
      dispatch(deleteUser(selectedUser._id));
      setOpenDeleteDialog(false);
      setSelectedUser(null);
    }
  };

  // Calculate user statistics
  const totalUsers = users?.length || 0;

  // Pagination
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );
  const pageCount = Math.ceil(filteredUsers.length / rowsPerPage);

  return (
    <Box sx={{ p: 3 }}>
      {/* Page Header */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: "bold", mb: 1 }}
          >
            User Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View and manage all users on the platform
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
          <Tooltip title="This feature is not implemented yet">
            <span>
              <Button
                variant="contained"
                startIcon={<PersonAdd />}
                disabled
                sx={{
                  borderRadius: 2,
                  py: 1,
                  boxShadow: 2,
                  "&:hover": {
                    boxShadow: 4,
                  },
                }}
              >
                Add User
              </Button>
            </span>
          </Tooltip>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 2,
              height: "100%",
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              transition:
                "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
              "&:hover": {
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                transform: "translateY(-2px)",
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    width: 48,
                    height: 48,
                  }}
                >
                  <PersonAdd />
                </Avatar>
                <Box sx={{ ml: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Total Users
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                    {loading ? <CircularProgress size={24} /> : totalUsers}
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ my: 2 }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 2,
              height: "100%",
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              transition:
                "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
              "&:hover": {
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                transform: "translateY(-2px)",
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: alpha(theme.palette.info.main, 0.1),
                    color: theme.palette.info.main,
                    width: 48,
                    height: 48,
                  }}
                >
                  <VerifiedUser />
                </Avatar>
                <Box sx={{ ml: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    User Roles
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                    {loading ? (
                      <CircularProgress size={24} />
                    ) : (
                      USER_ROLES.length
                    )}
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ my: 2 }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Search */}
      <Card
        elevation={0}
        sx={{
          borderRadius: 2,
          mb: 3,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        }}
      >
        <CardContent sx={{ p: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search users by name, email or username"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="action" />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 2 },
                }}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="role-filter-label">Filter by Role</InputLabel>
                <Select
                  labelId="role-filter-label"
                  value={roleFilter}
                  label="Filter by Role"
                  onChange={(e) => setRoleFilter(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="all">All Roles</MenuItem>
                  {USER_ROLES.map((role) => (
                    <MenuItem key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid
              item
              xs={12}
              md={3}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Tooltip title="Refresh Users">
                <IconButton
                  onClick={() => dispatch(fetchUsers())}
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    "&:hover": {
                      bgcolor: alpha(theme.palette.primary.main, 0.2),
                    },
                    mr: 1,
                  }}
                >
                  <Refresh />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* User List */}
      <Card
        elevation={0}
        sx={{
          borderRadius: 2,
          mb: 3,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        }}
      >
        <TableContainer
          component={Box}
          sx={{ maxHeight: 600, overflow: "auto" }}
        >
          <Table stickyHeader sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                  }}
                >
                  User
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                  }}
                >
                  Email
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                  }}
                >
                  Role
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                  }}
                >
                  Skills
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : paginatedUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                    <Typography variant="body1" color="text.secondary">
                      No users found matching your filters
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedUsers.map((user) => (
                  <TableRow
                    key={user._id}
                    sx={{
                      "&:hover": {
                        bgcolor: alpha(theme.palette.primary.main, 0.02),
                      },
                      transition: "background-color 0.2s",
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                          src={user.avatar}
                          alt={user.name}
                          sx={{
                            width: 40,
                            height: 40,
                            mr: 2,
                            bgcolor: user.avatar
                              ? "transparent"
                              : theme.palette.primary.main,
                          }}
                        >
                          {!user.avatar && user.name?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: "medium" }}
                          >
                            {user.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            @{user.username}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={
                          user.role?.charAt(0).toUpperCase() +
                          user.role?.slice(1)
                        }
                        size="small"
                        sx={{
                          bgcolor:
                            user.role === "freelancer"
                              ? alpha(theme.palette.info.main, 0.1)
                              : user.role === "enterprise"
                              ? alpha(theme.palette.secondary.main, 0.1)
                              : alpha(theme.palette.success.main, 0.1),
                          color:
                            user.role === "freelancer"
                              ? theme.palette.info.main
                              : user.role === "enterprise"
                              ? theme.palette.secondary.main
                              : theme.palette.success.main,
                          fontWeight: "medium",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {user.info?.skills && user.info.skills.length > 0 ? (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {user.info.skills.slice(0, 2).map((skill, index) => (
                            <Chip
                              key={index}
                              label={skill}
                              size="small"
                              sx={{
                                fontSize: "0.7rem",
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                color: theme.palette.primary.main,
                              }}
                            />
                          ))}
                          {user.info.skills.length > 2 && (
                            <Chip
                              label={`+${user.info.skills.length - 2}`}
                              size="small"
                              sx={{
                                fontSize: "0.7rem",
                                bgcolor: alpha(theme.palette.grey[500], 0.1),
                                color: theme.palette.grey[700],
                              }}
                            />
                          )}
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No skills listed
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex" }}>
                        <Tooltip title="Edit User">
                          <IconButton
                            size="small"
                            onClick={() => handleEditClick(user)}
                            sx={{
                              color: theme.palette.primary.main,
                              "&:hover": {
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                              },
                            }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete User">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteClick(user)}
                            sx={{
                              color: theme.palette.error.main,
                              "&:hover": {
                                bgcolor: alpha(theme.palette.error.main, 0.1),
                              },
                            }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {pageCount > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
            <Pagination
              count={pageCount}
              page={page}
              onChange={(event, value) => setPage(value)}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Box>
        )}
      </Card>

      {/* Edit User Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Name"
                value={editFormData.name}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, name: e.target.value })
                }
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Username"
                value={editFormData.username}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, username: e.target.value })
                }
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={editFormData.email}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, email: e.target.value })
                }
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Role</InputLabel>
                <Select
                  value={editFormData.role}
                  label="Role"
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, role: e.target.value })
                  }
                >
                  {USER_ROLES.map((role) => (
                    <MenuItem key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Commission Rate (%)"
                type="number"
                value={editFormData.commissionRate}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    commissionRate: e.target.value,
                  })
                }
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Bio"
                multiline
                rows={3}
                value={editFormData.bio}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, bio: e.target.value })
                }
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Skills (comma separated)"
                value={editFormData.info.skills}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    info: { ...editFormData.info, skills: e.target.value },
                  })
                }
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Portfolio URL"
                value={editFormData.info.portfolio}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    info: { ...editFormData.info, portfolio: e.target.value },
                  })
                }
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Experience (comma separated)"
                value={editFormData.info.experience}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    info: { ...editFormData.info, experience: e.target.value },
                  })
                }
                margin="normal"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={() => setOpenEditDialog(false)}
            color="inherit"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleEditSubmit}
            color="primary"
            variant="contained"
            disabled={loading}
            startIcon={
              loading && <CircularProgress size={20} color="inherit" />
            }
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete user{" "}
            <strong>{selectedUser?.name}</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            color="inherit"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={loading}
            startIcon={
              loading && <CircularProgress size={20} color="inherit" />
            }
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminUsers;
