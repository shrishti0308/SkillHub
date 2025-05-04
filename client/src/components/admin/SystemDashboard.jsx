import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  Chip,
  Alert,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  FormControlLabel,
  useTheme,
  alpha,
  Tooltip,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  DeleteSweep as DeleteSweepIcon,
  Memory as MemoryIcon,
  Storage as StorageIcon,
  Speed as SpeedIcon,
} from "@mui/icons-material";

// Custom dark theme colors for consistent styling (same as in AdminDashboard.jsx)
const darkThemeColors = {
  background: {
    default: "#1a1d23", // dark
    paper: "#23272f", // grey
    card: "#23272f", // grey
    lighter: "#2a2f38", // slightly lighter than grey
  },
  primary: {
    main: "#58c4dc", // cyan-blue
    light: "#7ad4e6", // lighter cyan-blue
    dark: "#3a9cb2", // darker cyan-blue
  },
  text: {
    primary: "#f6f7f9", // light
    secondary: "#b0b7c3", // lighter grey
  },
  divider: "rgba(246, 247, 249, 0.12)", // light with opacity
};

const SystemDashboard = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [systemStatus, setSystemStatus] = useState(null);
  const [performanceMetrics, setPerformanceMetrics] = useState(null);
  const [isRedisEnabled, setIsRedisEnabled] = useState(true);
  const [flushSuccess, setFlushSuccess] = useState(null);
  const [isDevelopment, setIsDevelopment] = useState(false);

  // Fetch system status and performance data
  const fetchSystemData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get system status
      const statusResponse = await axiosInstance.get("/system/status");
      setSystemStatus(statusResponse.data);
      setIsDevelopment(statusResponse.data.node_env === "development");

      // Get performance metrics
      const metricsResponse = await axiosInstance.get("/system/performance");
      setPerformanceMetrics(metricsResponse.data);

      // Update Redis enabled state based on status
      setIsRedisEnabled(statusResponse.data.redis === "connected");
    } catch (err) {
      console.error("Error fetching system data:", err);
      setError(
        "Failed to fetch system data. " +
          (err.response?.data?.error || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  // Toggle Redis enabled/disabled
  const toggleRedisEnabled = async () => {
    try {
      const endpoint = isRedisEnabled
        ? "/system/redis/disable"
        : "/system/redis/enable";
      const response = await axiosInstance.post(endpoint);

      if (response.data.success) {
        setIsRedisEnabled(!isRedisEnabled);
        fetchSystemData(); // Refresh data
      }
    } catch (err) {
      console.error("Error toggling Redis:", err);
      setError(
        "Failed to toggle Redis. " + (err.response?.data?.error || err.message)
      );
    }
  };

  // Flush Redis cache
  const flushRedisCache = async () => {
    try {
      const response = await axiosInstance.post("/system/flush-cache");
      setFlushSuccess(response.data.message);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setFlushSuccess(null);
      }, 3000);

      // Refresh data
      fetchSystemData();
    } catch (err) {
      console.error("Error flushing Redis cache:", err);
      setError(
        "Failed to flush Redis cache. " +
          (err.response?.data?.error || err.message)
      );
    }
  };

  // Format uptime to a readable string
  const formatUptime = (seconds) => {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${days}d ${hours}h ${minutes}m ${remainingSeconds}s`;
  };

  // Format bytes to a readable size
  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  // Initial data fetch
  useEffect(() => {
    fetchSystemData();
  }, []);

  return (
    <Container
      maxWidth="xl"
      sx={{
        bgcolor: darkThemeColors.background.default,
        color: darkThemeColors.text.primary,
        pt: 2,
        pb: 4,
      }}
    >
      {error && (
        <Alert
          severity="error"
          onClose={() => setError(null)}
          sx={{ mb: 3, borderRadius: 1 }}
        >
          {error}
        </Alert>
      )}

      {flushSuccess && (
        <Alert
          severity="success"
          onClose={() => setFlushSuccess(null)}
          sx={{ mb: 3, borderRadius: 1 }}
        >
          {flushSuccess}
        </Alert>
      )}

      {/* Dashboard Header */}
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
            sx={{
              fontWeight: "bold",
              mb: 1,
              color: darkThemeColors.text.primary,
            }}
          >
            System Dashboard
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: darkThemeColors.text.secondary }}
          >
            Monitor system status and Redis performance
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<RefreshIcon />}
            onClick={fetchSystemData}
            disabled={loading}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              boxShadow: 2,
              bgcolor: darkThemeColors.primary.main,
              "&:hover": {
                bgcolor: darkThemeColors.primary.dark,
                boxShadow: 4,
              },
            }}
          >
            Refresh
          </Button>
          {isDevelopment && (
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteSweepIcon />}
              onClick={flushRedisCache}
              disabled={loading || systemStatus?.redis !== "connected"}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1,
                boxShadow: 2,
              }}
            >
              Flush Cache
            </Button>
          )}
        </Box>
      </Box>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "300px",
          }}
        >
          <CircularProgress
            size={60}
            sx={{ color: darkThemeColors.primary.main }}
          />
        </Box>
      ) : (
        <>
          {/* System Status Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={4}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 2,
                  height: "100%",
                  bgcolor: darkThemeColors.background.card,
                  border: `1px solid ${darkThemeColors.divider}`,
                  transition:
                    "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                  "&:hover": {
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Box
                      sx={{
                        borderRadius: "50%",
                        width: 48,
                        height: 48,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        bgcolor: alpha(darkThemeColors.primary.main, 0.2),
                        color: darkThemeColors.primary.main,
                      }}
                    >
                      <StorageIcon fontSize="large" />
                    </Box>
                    <Box sx={{ ml: 2 }}>
                      <Typography
                        variant="body2"
                        sx={{ color: darkThemeColors.text.secondary }}
                      >
                        Server Status
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: "bold",
                          color: darkThemeColors.text.primary,
                        }}
                      >
                        {systemStatus?.status || "Unknown"}
                      </Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ my: 2, bgcolor: darkThemeColors.divider }} />
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                  >
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ color: darkThemeColors.text.secondary }}
                      >
                        Environment
                      </Typography>
                      <Chip
                        label={systemStatus?.node_env || "Unknown"}
                        size="small"
                        sx={{
                          bgcolor: alpha(
                            systemStatus?.node_env === "production"
                              ? "#10b981"
                              : "#f97316",
                            0.2
                          ),
                          color:
                            systemStatus?.node_env === "production"
                              ? "#10b981"
                              : "#f97316",
                          fontWeight: "medium",
                        }}
                      />
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ color: darkThemeColors.text.secondary }}
                      >
                        Uptime
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: "medium",
                          color: darkThemeColors.text.primary,
                        }}
                      >
                        {systemStatus?.uptime
                          ? formatUptime(systemStatus.uptime)
                          : "Unknown"}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 2,
                  height: "100%",
                  bgcolor: darkThemeColors.background.card,
                  border: `1px solid ${darkThemeColors.divider}`,
                  transition:
                    "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                  "&:hover": {
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 2,
                      justifyContent: "space-between",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box
                        sx={{
                          borderRadius: "50%",
                          width: 48,
                          height: 48,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          bgcolor: alpha("#f87171", 0.2),
                          color: "#f87171",
                        }}
                      >
                        <MemoryIcon fontSize="large" />
                      </Box>
                      <Box sx={{ ml: 2 }}>
                        <Typography
                          variant="body2"
                          sx={{ color: darkThemeColors.text.secondary }}
                        >
                          Redis Status
                        </Typography>
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: "bold",
                            color: darkThemeColors.text.primary,
                          }}
                        >
                          {systemStatus?.redis === "connected"
                            ? "Connected"
                            : "Disconnected"}
                        </Typography>
                      </Box>
                    </Box>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={isRedisEnabled}
                          onChange={toggleRedisEnabled}
                          color="primary"
                          disabled={
                            systemStatus?.redis !== "connected" &&
                            isRedisEnabled
                          }
                        />
                      }
                      label={isRedisEnabled ? "Enabled" : "Disabled"}
                      sx={{ color: darkThemeColors.text.secondary }}
                    />
                  </Box>
                  <Divider sx={{ my: 2, bgcolor: darkThemeColors.divider }} />
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                  >
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ color: darkThemeColors.text.secondary }}
                      >
                        Cache Keys
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: "medium",
                          color: darkThemeColors.text.primary,
                        }}
                      >
                        {performanceMetrics?.redis?.keysCount ?? "N/A"}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ color: darkThemeColors.text.secondary }}
                      >
                        Cache Hits
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: "medium",
                          color: darkThemeColors.text.primary,
                        }}
                      >
                        {performanceMetrics?.redis?.cacheHits ?? "N/A"}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 2,
                  height: "100%",
                  bgcolor: darkThemeColors.background.card,
                  border: `1px solid ${darkThemeColors.divider}`,
                  transition:
                    "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                  "&:hover": {
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Box
                      sx={{
                        borderRadius: "50%",
                        width: 48,
                        height: 48,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        bgcolor: alpha("#10b981", 0.2),
                        color: "#10b981",
                      }}
                    >
                      <SpeedIcon fontSize="large" />
                    </Box>
                    <Box sx={{ ml: 2 }}>
                      <Typography
                        variant="body2"
                        sx={{ color: darkThemeColors.text.secondary }}
                      >
                        MongoDB Status
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: "bold",
                          color: darkThemeColors.text.primary,
                        }}
                      >
                        {systemStatus?.mongodb === "connected"
                          ? "Connected"
                          : "Disconnected"}
                      </Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ my: 2, bgcolor: darkThemeColors.divider }} />
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                  >
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ color: darkThemeColors.text.secondary }}
                      >
                        Collections
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: "medium",
                          color: darkThemeColors.text.primary,
                        }}
                      >
                        {performanceMetrics?.mongodb?.collections ?? "N/A"}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ color: darkThemeColors.text.secondary }}
                      >
                        Documents
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: "medium",
                          color: darkThemeColors.text.primary,
                        }}
                      >
                        {performanceMetrics?.mongodb?.objects ?? "N/A"}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* MongoDB Stats Table */}
          <Card
            elevation={0}
            sx={{
              borderRadius: 2,
              mb: 4,
              bgcolor: darkThemeColors.background.card,
              border: `1px solid ${darkThemeColors.divider}`,
            }}
          >
            <CardHeader
              title={
                <Typography
                  variant="h6"
                  sx={{ color: darkThemeColors.text.primary }}
                >
                  MongoDB Statistics
                </Typography>
              }
              sx={{
                borderBottom: `1px solid ${darkThemeColors.divider}`,
                pb: 2,
              }}
            />
            <TableContainer
              component={Box}
              sx={{ maxHeight: 440, overflow: "auto" }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        bgcolor: darkThemeColors.background.lighter,
                        color: darkThemeColors.text.primary,
                        borderBottom: `1px solid ${darkThemeColors.divider}`,
                      }}
                    >
                      Metric
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        bgcolor: darkThemeColors.background.lighter,
                        color: darkThemeColors.text.primary,
                        borderBottom: `1px solid ${darkThemeColors.divider}`,
                      }}
                    >
                      Value
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {performanceMetrics?.mongodb ? (
                    <>
                      <TableRow>
                        <TableCell
                          sx={{
                            color: darkThemeColors.text.primary,
                            borderBottom: `1px solid ${darkThemeColors.divider}`,
                          }}
                        >
                          Collections
                        </TableCell>
                        <TableCell
                          sx={{
                            color: darkThemeColors.text.primary,
                            borderBottom: `1px solid ${darkThemeColors.divider}`,
                          }}
                        >
                          {performanceMetrics.mongodb.collections}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{
                            color: darkThemeColors.text.primary,
                            borderBottom: `1px solid ${darkThemeColors.divider}`,
                          }}
                        >
                          Documents
                        </TableCell>
                        <TableCell
                          sx={{
                            color: darkThemeColors.text.primary,
                            borderBottom: `1px solid ${darkThemeColors.divider}`,
                          }}
                        >
                          {performanceMetrics.mongodb.objects}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{
                            color: darkThemeColors.text.primary,
                            borderBottom: `1px solid ${darkThemeColors.divider}`,
                          }}
                        >
                          Average Object Size
                        </TableCell>
                        <TableCell
                          sx={{
                            color: darkThemeColors.text.primary,
                            borderBottom: `1px solid ${darkThemeColors.divider}`,
                          }}
                        >
                          {formatBytes(performanceMetrics.mongodb.avgObjSize)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{
                            color: darkThemeColors.text.primary,
                            borderBottom: `1px solid ${darkThemeColors.divider}`,
                          }}
                        >
                          Total Data Size
                        </TableCell>
                        <TableCell
                          sx={{
                            color: darkThemeColors.text.primary,
                            borderBottom: `1px solid ${darkThemeColors.divider}`,
                          }}
                        >
                          {formatBytes(performanceMetrics.mongodb.dataSize)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{
                            color: darkThemeColors.text.primary,
                            borderBottom: `1px solid ${darkThemeColors.divider}`,
                          }}
                        >
                          Indexes
                        </TableCell>
                        <TableCell
                          sx={{
                            color: darkThemeColors.text.primary,
                            borderBottom: `1px solid ${darkThemeColors.divider}`,
                          }}
                        >
                          {performanceMetrics.mongodb.indexes}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{
                            color: darkThemeColors.text.primary,
                            borderBottom: `1px solid ${darkThemeColors.divider}`,
                          }}
                        >
                          Index Size
                        </TableCell>
                        <TableCell
                          sx={{
                            color: darkThemeColors.text.primary,
                            borderBottom: `1px solid ${darkThemeColors.divider}`,
                          }}
                        >
                          {formatBytes(performanceMetrics.mongodb.indexSize)}
                        </TableCell>
                      </TableRow>
                    </>
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={2}
                        align="center"
                        sx={{
                          py: 3,
                          color: darkThemeColors.text.secondary,
                          borderBottom: `1px solid ${darkThemeColors.divider}`,
                        }}
                      >
                        No MongoDB statistics available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>

          {/* Redis Stats Table */}
          <Card
            elevation={0}
            sx={{
              borderRadius: 2,
              bgcolor: darkThemeColors.background.card,
              border: `1px solid ${darkThemeColors.divider}`,
            }}
          >
            <CardHeader
              title={
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ color: darkThemeColors.text.primary }}
                  >
                    Redis Cache Status
                  </Typography>
                  {isDevelopment && (
                    <Tooltip title="Flush Redis Cache">
                      <IconButton
                        onClick={flushRedisCache}
                        disabled={
                          loading || systemStatus?.redis !== "connected"
                        }
                        sx={{ color: theme.palette.error.main }}
                      >
                        <DeleteSweepIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              }
              sx={{
                borderBottom: `1px solid ${darkThemeColors.divider}`,
                pb: 2,
              }}
            />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TableContainer component={Box}>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell
                            sx={{
                              color: darkThemeColors.text.primary,
                              borderBottom: `1px solid ${darkThemeColors.divider}`,
                              fontWeight: "bold",
                            }}
                          >
                            Status
                          </TableCell>
                          <TableCell
                            sx={{
                              color: darkThemeColors.text.primary,
                              borderBottom: `1px solid ${darkThemeColors.divider}`,
                            }}
                          >
                            <Chip
                              label={
                                systemStatus?.redis === "connected"
                                  ? "Connected"
                                  : "Disconnected"
                              }
                              size="small"
                              sx={{
                                bgcolor: alpha(
                                  systemStatus?.redis === "connected"
                                    ? "#10b981"
                                    : "#ef4444",
                                  0.2
                                ),
                                color:
                                  systemStatus?.redis === "connected"
                                    ? "#10b981"
                                    : "#ef4444",
                                fontWeight: "medium",
                              }}
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            sx={{
                              color: darkThemeColors.text.primary,
                              borderBottom: `1px solid ${darkThemeColors.divider}`,
                              fontWeight: "bold",
                            }}
                          >
                            Cache Enabled
                          </TableCell>
                          <TableCell
                            sx={{
                              color: darkThemeColors.text.primary,
                              borderBottom: `1px solid ${darkThemeColors.divider}`,
                            }}
                          >
                            <Chip
                              label={isRedisEnabled ? "Enabled" : "Disabled"}
                              size="small"
                              sx={{
                                bgcolor: alpha(
                                  isRedisEnabled ? "#10b981" : "#ef4444",
                                  0.2
                                ),
                                color: isRedisEnabled ? "#10b981" : "#ef4444",
                                fontWeight: "medium",
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TableContainer component={Box}>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell
                            sx={{
                              color: darkThemeColors.text.primary,
                              borderBottom: `1px solid ${darkThemeColors.divider}`,
                              fontWeight: "bold",
                            }}
                          >
                            Total Keys
                          </TableCell>
                          <TableCell
                            sx={{
                              color: darkThemeColors.text.primary,
                              borderBottom: `1px solid ${darkThemeColors.divider}`,
                            }}
                          >
                            {performanceMetrics?.redis?.keysCount ?? "N/A"}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            sx={{
                              color: darkThemeColors.text.primary,
                              borderBottom: `1px solid ${darkThemeColors.divider}`,
                              fontWeight: "bold",
                            }}
                          >
                            Cache Hits
                          </TableCell>
                          <TableCell
                            sx={{
                              color: darkThemeColors.text.primary,
                              borderBottom: `1px solid ${darkThemeColors.divider}`,
                            }}
                          >
                            {performanceMetrics?.redis?.cacheHits ?? "N/A"}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </>
      )}
    </Container>
  );
};

export default SystemDashboard;
