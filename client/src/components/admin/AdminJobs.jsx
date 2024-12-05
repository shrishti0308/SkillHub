import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
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
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { fetchJobs, deleteJob, updateJob } from '../../redux/slices/adminJobsSlice';

const JOB_STATUS_OPTIONS = ['open', 'in-progress', 'completed', 'closed'];

const AdminJobs = () => {
  const dispatch = useDispatch();
  const { jobs, loading, error } = useSelector((state) => state.adminJobs);
  const [selectedJob, setSelectedJob] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    status: '',
    budget: { min: 0, max: 0 },
    categories: '',
    skillsRequired: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredJobs, setFilteredJobs] = useState([]);

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  useEffect(() => {
    if (jobs) {
      let filtered = [...jobs];
      
      // Apply search filter
      if (searchQuery) {
        filtered = filtered.filter(job =>
          job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.skills?.join(' ').toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Apply status filter
      if (statusFilter !== 'all') {
        filtered = filtered.filter(job => job.status === statusFilter);
      }

      setFilteredJobs(filtered);
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
        max: job.budget?.max || 0 
      },
      categories: job.categories?.join(', ') || '',
      skillsRequired: job.skillsRequired?.join(', ') || ''
    });
    setOpenEditDialog(true);
  };

  const handleEditSubmit = async () => {
    const updates = {
      ...editFormData,
      categories: editFormData.categories.split(',').map(cat => cat.trim()).filter(Boolean),
      skillsRequired: editFormData.skillsRequired.split(',').map(skill => skill.trim()).filter(Boolean)
    };
    
    await dispatch(updateJob({ jobId: selectedJob._id, updates }));
    setOpenEditDialog(false);
  };

  const handleDeleteClick = (job) => {
    setSelectedJob(job);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (selectedJob) {
      dispatch(deleteJob(selectedJob._id));
      setOpenDeleteDialog(false);
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!jobs || !Array.isArray(jobs)) return <Typography>No jobs available</Typography>;

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom color="white">
        Job Management
      </Typography>

      {/* Search and Filter Section */}
      <Box mb={3}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              variant="outlined"
              label="Search jobs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ 
                backgroundColor: 'white',
                borderRadius: 1,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'white',
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              select
              fullWidth
              variant="outlined"
              label="Filter by status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{ 
                backgroundColor: 'white',
                borderRadius: 1,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'white',
                  },
                },
              }}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="open">Open</MenuItem>
              <MenuItem value="in-progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body1" color="white">
              Total Jobs: {filteredJobs.length}
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Employer</TableCell>
              <TableCell>Categories</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Budget</TableCell>
              <TableCell>Posted Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredJobs.map((job) => (
              <TableRow key={job._id}>
                <TableCell>{job.title}</TableCell>
                <TableCell>{job.employer?.name}</TableCell>
                <TableCell>{job.categories?.join(', ')}</TableCell>
                <TableCell>
                  <Chip
                    label={job.status}
                    color={job.status === 'open' ? 'success' : 
                           job.status === 'in-progress' ? 'primary' :
                           job.status === 'completed' ? 'info' : 'default'}
                  />
                </TableCell>
                <TableCell>${job.budget?.min} - ${job.budget?.max}</TableCell>
                <TableCell>{new Date(job.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <IconButton 
                    color="primary"
                    onClick={() => handleEditClick(job)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteClick(job)}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this job posting? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Job Dialog */}
      <Dialog 
        open={openEditDialog} 
        onClose={() => setOpenEditDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Job</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={editFormData.title}
                onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                value={editFormData.description}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Status"
                value={editFormData.status}
                onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
              >
                {JOB_STATUS_OPTIONS.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Categories (comma-separated)"
                value={editFormData.categories}
                onChange={(e) => setEditFormData({ ...editFormData, categories: e.target.value })}
                helperText="Enter categories separated by commas"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Minimum Budget"
                value={editFormData.budget.min}
                onChange={(e) => setEditFormData({
                  ...editFormData,
                  budget: { ...editFormData.budget, min: Number(e.target.value) }
                })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Maximum Budget"
                value={editFormData.budget.max}
                onChange={(e) => setEditFormData({
                  ...editFormData,
                  budget: { ...editFormData.budget, max: Number(e.target.value) }
                })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Required Skills (comma-separated)"
                value={editFormData.skillsRequired}
                onChange={(e) => setEditFormData({ ...editFormData, skillsRequired: e.target.value })}
                helperText="Enter required skills separated by commas"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminJobs;
