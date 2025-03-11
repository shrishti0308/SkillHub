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
  Chip,
  Grid,
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
  Stack,
} from "@mui/material";
import {
  Delete,
  Edit,
  Search,
  Refresh,
  Work,
  AttachMoney,
} from "@mui/icons-material";
import {
  fetchJobs,
  deleteJob,
  updateJob,
} from "../../redux/slices/adminJobsSlice";

const JOB_STATUS_OPTIONS = ["open", "in-progress", "completed", "closed"];

const AdminJobs = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { jobs, loading } = useSelector((state) => state.adminJobs);
  const [selectedJob, setSelectedJob] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    status: "",
    budget: { min: 0, max: 0 },
    categories: "",
    skillsRequired: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  useEffect(() => {
    if (jobs) {
      let filtered = [...jobs];

      // Apply search filter
      if (searchQuery) {
        filtered = filtered.filter(
          (job) =>
            job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.description
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            job.skills
              ?.join(" ")
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
        );
      }

      // Apply status filter
      if (statusFilter !== "all") {
        filtered = filtered.filter((job) => job.status === statusFilter);
      }

      setFilteredJobs(filtered);
      setPage(1); // Reset to first page when filters change
    }
  }, [jobs, searchQuery, statusFilter]);

  const handleEditClick = (job) => {
    setSelectedJob(job);
    setEditFormData({
      title: job.title,
      description: job.description,
      status: job.status,
      budget: {
        min: job.budget?.min || 0,
        max: job.budget?.max || 0,
      },
      categories: job.categories?.join(", ") || "",
      skillsRequired: job.skillsRequired?.join(", ") || "",
    });
    setOpenEditDialog(true);
  };

  const handleEditSubmit = async () => {
    const updates = {
      ...editFormData,
      categories: editFormData.categories
        .split(",")
        .map((cat) => cat.trim())
        .filter(Boolean),
      skillsRequired: editFormData.skillsRequired
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
    };

    await dispatch(updateJob({ jobId: selectedJob._id, updates }));
    setOpenEditDialog(false);
    setSelectedJob(null);
  };

  const handleDeleteClick = (job) => {
    setSelectedJob(job);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (selectedJob) {
      dispatch(deleteJob(selectedJob._id));
      setOpenDeleteDialog(false);
      setSelectedJob(null);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Calculate job statistics
  const totalJobs = jobs?.length || 0;
  const openJobs = jobs?.filter((job) => job.status === "open")?.length || 0;
  const inProgressJobs =
    jobs?.filter((job) => job.status === "in-progress")?.length || 0;
  const completedJobs =
    jobs?.filter((job) => job.status === "completed")?.length || 0;
  const closedJobs =
    jobs?.filter((job) => job.status === "closed")?.length || 0;

  // Calculate average budget
  const avgBudget =
    jobs && jobs.length > 0
      ? jobs.reduce(
          (sum, job) =>
            sum + ((job.budget?.min || 0) + (job.budget?.max || 0)) / 2,
          0
        ) / jobs.length
      : 0;

  // Pagination
  const paginatedJobs = filteredJobs.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );
  const pageCount = Math.ceil(filteredJobs.length / rowsPerPage);

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
            Job Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View and manage all jobs on the platform
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
          <Tooltip title="This feature is not implemented yet">
            <span>
              <Button
                variant="contained"
                startIcon={<Work />}
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
                Add Job
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
                  <Work />
                </Avatar>
                <Box sx={{ ml: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Total Jobs
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                    {loading ? <CircularProgress size={24} /> : totalJobs}
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Stack direction="row" spacing={1} justifyContent="space-between">
                <Chip
                  label={`${openJobs} Open`}
                  size="small"
                  sx={{
                    bgcolor: alpha(theme.palette.info.main, 0.1),
                    color: theme.palette.info.main,
                    fontWeight: "medium",
                  }}
                />
                <Chip
                  label={`${inProgressJobs} In Progress`}
                  size="small"
                  sx={{
                    bgcolor: alpha(theme.palette.warning.main, 0.1),
                    color: theme.palette.warning.main,
                    fontWeight: "medium",
                  }}
                />
              </Stack>
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
                    bgcolor: alpha(theme.palette.success.main, 0.1),
                    color: theme.palette.success.main,
                    width: 48,
                    height: 48,
                  }}
                >
                  <AttachMoney />
                </Avatar>
                <Box sx={{ ml: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Avg. Budget
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                    {loading ? (
                      <CircularProgress size={24} />
                    ) : (
                      `$${avgBudget.toFixed(0)}`
                    )}
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Stack direction="row" spacing={1} justifyContent="space-between">
                <Chip
                  label={`${completedJobs} Completed`}
                  size="small"
                  sx={{
                    bgcolor: alpha(theme.palette.success.main, 0.1),
                    color: theme.palette.success.main,
                    fontWeight: "medium",
                  }}
                />
                <Chip
                  label={`${closedJobs} Closed`}
                  size="small"
                  sx={{
                    bgcolor: alpha(theme.palette.error.main, 0.1),
                    color: theme.palette.error.main,
                    fontWeight: "medium",
                  }}
                />
              </Stack>
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
                placeholder="Search jobs by title, description or skills"
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
                <InputLabel id="status-filter-label">
                  Filter by Status
                </InputLabel>
                <Select
                  labelId="status-filter-label"
                  value={statusFilter}
                  label="Filter by Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  {JOB_STATUS_OPTIONS.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() +
                        status.slice(1).replace("-", " ")}
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
              <Tooltip title="Refresh Jobs">
                <IconButton
                  onClick={() => dispatch(fetchJobs())}
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

      {/* Job List */}
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
                  Job Title
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                  }}
                >
                  Budget
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                  }}
                >
                  Categories
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
              ) : paginatedJobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                    <Typography variant="body1" color="text.secondary">
                      No jobs found matching your filters
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedJobs.map((job) => (
                  <TableRow
                    key={job._id}
                    sx={{
                      "&:hover": {
                        bgcolor: alpha(theme.palette.primary.main, 0.02),
                      },
                      transition: "background-color 0.2s",
                    }}
                  >
                    <TableCell>
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: "medium" }}
                        >
                          {job.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "300px",
                          }}
                        >
                          {job.description}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                        ${job.budget?.min || 0} - ${job.budget?.max || 0}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {job.categories && job.categories.length > 0 ? (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {job.categories.slice(0, 2).map((category, index) => (
                            <Chip
                              key={index}
                              label={category}
                              size="small"
                              sx={{
                                fontSize: "0.7rem",
                                bgcolor: alpha(
                                  theme.palette.secondary.main,
                                  0.1
                                ),
                                color: theme.palette.secondary.main,
                              }}
                            />
                          ))}
                          {job.categories.length > 2 && (
                            <Chip
                              label={`+${job.categories.length - 2}`}
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
                          No categories
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {job.skillsRequired && job.skillsRequired.length > 0 ? (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {job.skillsRequired
                            .slice(0, 2)
                            .map((skill, index) => (
                              <Chip
                                key={index}
                                label={skill}
                                size="small"
                                sx={{
                                  fontSize: "0.7rem",
                                  bgcolor: alpha(
                                    theme.palette.primary.main,
                                    0.1
                                  ),
                                  color: theme.palette.primary.main,
                                }}
                              />
                            ))}
                          {job.skillsRequired.length > 2 && (
                            <Chip
                              label={`+${job.skillsRequired.length - 2}`}
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
                          No skills required
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex" }}>
                        <Tooltip title="Edit Job">
                          <IconButton
                            size="small"
                            onClick={() => handleEditClick(job)}
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
                        <Tooltip title="Delete Job">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteClick(job)}
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
              onChange={handlePageChange}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Box>
        )}
      </Card>

      {/* Edit Job Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Job</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Job Title"
                value={editFormData.title}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, title: e.target.value })
                }
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                value={editFormData.description}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    description: e.target.value,
                  })
                }
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  value={editFormData.status}
                  label="Status"
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, status: e.target.value })
                  }
                >
                  {JOB_STATUS_OPTIONS.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() +
                        status.slice(1).replace("-", " ")}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Min Budget"
                type="number"
                value={editFormData.budget.min}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    budget: {
                      ...editFormData.budget,
                      min: Number(e.target.value),
                    },
                  })
                }
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Max Budget"
                type="number"
                value={editFormData.budget.max}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    budget: {
                      ...editFormData.budget,
                      max: Number(e.target.value),
                    },
                  })
                }
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Categories (comma separated)"
                value={editFormData.categories}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    categories: e.target.value,
                  })
                }
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Skills Required (comma separated)"
                value={editFormData.skillsRequired}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    skillsRequired: e.target.value,
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
            Are you sure you want to delete job{" "}
            <strong>{selectedJob?.title}</strong>? This action cannot be undone.
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

export default AdminJobs;
