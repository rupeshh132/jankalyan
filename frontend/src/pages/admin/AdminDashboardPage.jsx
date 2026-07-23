import React from 'react';
import { useAdminDashboard } from '../../hooks/useAdminDashboard';
import { useAdminComplaints } from '../../hooks/useAdminComplaints';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { 
  FileText, Clock, PlayCircle, CheckCircle, XCircle, Activity, 
  BarChart2, PieChart as PieChartIcon, ArrowRight
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import ComplaintTable from '../../components/admin/ComplaintTable';
import AdminLoadingSkeleton from '../../components/admin/AdminLoadingSkeleton';
import '../../components/complaint/complaint.css';
import '../../components/admin/admin.css';

const AdminDashboardPage = () => {
  const { data: dashboardData, isLoading: isDashboardLoading } = useAdminDashboard();
  const { data: recentComplaintsData, isLoading: isRecentLoading } = useAdminComplaints(0, 10, '', '', '', 'createdAt,desc');

  if (isDashboardLoading) return <div className="mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8 py-6"><AdminLoadingSkeleton type="cards" /></div>;

  const stats = dashboardData?.data || {};

  // Parse Charts Data
  const monthlyTrendData = stats.monthlyTrend 
    ? Object.entries(stats.monthlyTrend)
        .reverse() // from DB they are desc, we need asc for chart
        .map(([month, count]) => ({ month, count }))
    : [];

  const categoryData = stats.complaintsByCategory
    ? Object.entries(stats.complaintsByCategory).map(([name, value]) => ({ name, value }))
    : [];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

  const SummaryCard = ({ title, value, icon: Icon, colorClass }) => (
    <Card className={`border-t-4 ${colorClass}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value || 0}</div>
      </CardContent>
    </Card>
  );

  return (
    <div className="mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8 py-6 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of system metrics and complaint status.</p>
        </div>
        <Link to="/admin/complaints">
          <Button className="w-full sm:w-auto shadow-sm">
            Manage Complaints
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
      
      {/* Top Row: Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <SummaryCard title="Total Complaints" value={stats.totalComplaints} icon={FileText} colorClass="border-t-blue-500" />
        <SummaryCard title="Pending" value={stats.submittedCount} icon={Clock} colorClass="border-t-amber-500" />
        <SummaryCard title="In Progress" value={stats.underReviewCount} icon={PlayCircle} colorClass="border-t-violet-500" />
        <SummaryCard title="Resolved" value={stats.resolvedCount} icon={CheckCircle} colorClass="border-t-emerald-500" />
        <SummaryCard title="Rejected" value={stats.rejectedCount} icon={XCircle} colorClass="border-t-red-500" />
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard 
          title="Avg Resolution Time" 
          value={stats.averageResolutionTime ? `${stats.averageResolutionTime.toFixed(1)} hrs` : 'N/A'} 
          icon={Activity} 
          colorClass="border-t-cyan-500" 
        />
        <SummaryCard 
          title="Closed Today" 
          value={stats.closedTodayCount} 
          icon={CheckCircle} 
          colorClass="border-t-emerald-500" 
        />
        <SummaryCard 
          title="Open Complaints" 
          value={(stats.totalComplaints || 0) - (stats.resolvedCount || 0) - (stats.rejectedCount || 0)} 
          icon={FileText} 
          colorClass="border-t-amber-500" 
        />
      </div>

      {/* Middle Row: Charts */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Monthly Trend Chart */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-primary" />
              <CardTitle>Monthly Complaint Trend</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="h-[300px]">
            {monthlyTrendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No trend data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Category Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <div className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-primary" />
              <CardTitle>Complaints by Category</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="h-[300px]">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No category data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row: Recent Complaints */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Complaints</CardTitle>
          <CardDescription>Latest issues submitted requiring attention.</CardDescription>
        </CardHeader>
        <CardContent>
          {isRecentLoading ? (
            <AdminLoadingSkeleton type="table" />
          ) : recentComplaintsData?.data?.content?.length > 0 ? (
            <ComplaintTable data={recentComplaintsData} onPageChange={() => {}} />
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No recent complaints found.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardPage;
