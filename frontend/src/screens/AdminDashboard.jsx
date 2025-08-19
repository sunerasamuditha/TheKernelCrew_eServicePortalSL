import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const AdminDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30'); // days

  useEffect(() => {
    // Mock analytics data
    const mockAnalytics = {
      peakHours: [
        { hour: 9, count: 45 },
        { hour: 10, count: 62 },
        { hour: 11, count: 38 },
        { hour: 14, count: 41 },
        { hour: 15, count: 33 },
        { hour: 16, count: 28 }
      ],
      departmentStats: [
        { department: 'Immigration and Emigration', count: 245, color: '#0088FE' },
        { department: 'Department of Motor Traffic', count: 189, color: '#00C49F' },
        { department: 'Registrar General', count: 156, color: '#FFBB28' },
        { department: 'National Registration Dept', count: 98, color: '#FF8042' }
      ],
      statusStats: [
        { status: 'COMPLETED', count: 312, color: '#28a745' },
        { status: 'SCHEDULED', count: 156, color: '#007bff' },
        { status: 'IN_PROGRESS', count: 89, color: '#17a2b8' },
        { status: 'NO_SHOW', count: 34, color: '#dc3545' },
        { status: 'CANCELLED', count: 21, color: '#6c757d' }
      ],
      feedbackStats: [
        { department: 'Immigration and Emigration', avg_rating: 4.2, feedback_count: 124 },
        { department: 'Department of Motor Traffic', avg_rating: 3.8, feedback_count: 89 },
        { department: 'Registrar General', avg_rating: 4.5, feedback_count: 67 },
        { department: 'National Registration Dept', avg_rating: 4.1, feedback_count: 45 }
      ],
      totalAppointments: 1247,
      totalUsers: 2890,
      averageRating: 4.2,
      completionRate: 78.4
    };

    setAnalyticsData(mockAnalytics);
    setLoading(false);
  }, [timeRange]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div>Loading analytics...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', background: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '12px',
        marginBottom: '2rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ 
              color: '#005A70', 
              fontSize: '2rem', 
              fontWeight: '700',
              marginBottom: '0.5rem'
            }}>
              Analytics Dashboard
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: '1.1rem' }}>
              Government Services Portal - Administrative Overview
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <label style={{ fontWeight: '600', color: 'var(--text)' }}>Time Range:</label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid var(--card-border)',
                borderRadius: '6px',
                background: 'white',
                cursor: 'pointer'
              }}
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📅</div>
          <h3 style={{ color: '#005A70', fontSize: '2rem', fontWeight: '700', marginBottom: '0.25rem' }}>
            {analyticsData.totalAppointments.toLocaleString()}
          </h3>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Total Appointments</p>
        </div>

        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>👥</div>
          <h3 style={{ color: '#005A70', fontSize: '2rem', fontWeight: '700', marginBottom: '0.25rem' }}>
            {analyticsData.totalUsers.toLocaleString()}
          </h3>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Registered Users</p>
        </div>

        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⭐</div>
          <h3 style={{ color: '#005A70', fontSize: '2rem', fontWeight: '700', marginBottom: '0.25rem' }}>
            {analyticsData.averageRating.toFixed(1)}
          </h3>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Average Rating</p>
        </div>

        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>✅</div>
          <h3 style={{ color: '#005A70', fontSize: '2rem', fontWeight: '700', marginBottom: '0.25rem' }}>
            {analyticsData.completionRate}%
          </h3>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Completion Rate</p>
        </div>
      </div>

      {/* Charts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        {/* Peak Hours Chart */}
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#005A70', marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: '600' }}>
            Peak Booking Hours
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.peakHours}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="hour" 
                tickFormatter={(value) => `${value}:00`}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => `${value}:00`}
                formatter={(value) => [value, 'Appointments']}
              />
              <Bar dataKey="count" fill="#005A70" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Department Stats Pie Chart */}
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#005A70', marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: '600' }}>
            Appointments by Department
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analyticsData.departmentStats}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ department, percent }) => `${department.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {analyticsData.departmentStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem'
      }}>
        {/* Status Distribution */}
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#005A70', marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: '600' }}>
            Appointment Status Distribution
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {analyticsData.statusStats.map((stat, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: stat.color
                }}></div>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: '500' }}>{stat.status}</span>
                  <span style={{ fontWeight: '600', color: '#005A70' }}>{stat.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback Ratings */}
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#005A70', marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: '600' }}>
            Average Feedback Rating by Department
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={analyticsData.feedbackStats} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 5]} />
              <YAxis dataKey="department" type="category" width={120} fontSize={12} />
              <Tooltip 
                formatter={(value) => [value.toFixed(1), 'Rating']}
              />
              <Bar dataKey="avg_rating" fill="#FFD700" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
