import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Card, CardContent, Chip, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { TrendingUp, Warning, Inventory, Error, TrendingDown } from '@mui/icons-material';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend } from 'chart.js';
import { dashboardAPI } from '../services/api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend);

const StatCard = ({ title, value, subtitle, icon, color }) => (
  <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', height: '100%' }}>
    <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <div>
        <Typography fontSize={13} color="text.secondary">{title}</Typography>
        <Typography variant="h4" fontWeight="bold">{value}</Typography>
        {subtitle && <Typography fontSize={12} color="text.secondary">{subtitle}</Typography>}
      </div>
      <div style={{ width:44, height:44, borderRadius:8, backgroundColor:`${color}22`, display:'flex', alignItems:'center', justifyContent:'center' }}>
        {icon}
      </div>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [data, setData] = useState(null);
  useEffect(() => { dashboardAPI.getOverview().then(res => setData(res.data)).catch(console.error); }, []);
  if (!data) return <Typography>Loading...</Typography>;

  const expiryData = {
    labels: data.expiryForecast?.map(f => f.month) || [],
    datasets: [{ label:'Expiry Volume', data:data.expiryForecast?.map(f=>f.expiryVolume)||[], borderColor:'#ef4444', backgroundColor:'rgba(239,68,68,0.15)', fill:true, tension:0.4 }]
  };
  const distData = { labels:Object.keys(data.stockDistribution||{}), datasets:[{ data:Object.values(data.stockDistribution||{}).map(d=>d.count), backgroundColor:Object.values(data.stockDistribution||{}).map(d=>d.color||'#3b82f6') }] };

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', marginBottom:16}}>
        <div>
          <Typography variant="h4" fontWeight="bold">Dashboard Overview</Typography>
          <Typography color="text.secondary">Real-time inventory snapshot and expiry alerts</Typography>
        </div>
        <div style={{textAlign:'right'}}>
          <Typography fontSize={13} fontWeight={600}>{new Date().toLocaleDateString('en-US',{ weekday:'long', month:'long', day:'numeric', year:'numeric'})}</Typography>
          <Typography fontSize={12} color="success.main">System Status: Healthy</Typography>
        </div>
      </div>

      <Grid container spacing={3}>
        {[
          { title:'Total Stock', value:data.totalStock, subtitle:'Items across all categories', color:'#3b82f6', icon:<Inventory sx={{ color:'#3b82f6' }} /> },
          { title:'Inventory Value', value:`₹${data.inventoryValue?.toFixed(2)||0}`, subtitle:'Estimated retail value', color:'#10b981', icon:<TrendingUp sx={{ color:'#10b981' }} /> },
          { title:'Near Expiry', value:data.nearExpiryCount, subtitle:'Action needed within 30 days', color:'#f59e0b', icon:<Warning sx={{ color:'#f59e0b' }} /> },
          { title:'Expired Items', value:data.expiredCount, subtitle:'Requires immediate disposal', color:'#ef4444', icon:<Error sx={{ color:'#ef4444' }} /> }
        ].map((stat,i)=><Grid key={i} item xs={12} sm={6} md={3}><StatCard {...stat} /></Grid>)}

        <Grid item xs={12} md={8}>
          <Paper sx={{ p:3, height:380, borderRadius:3, border:'2px solid #e2e8f0' }}>
            <Typography variant="h6" fontWeight="bold">Expiry Forecast (Next 6 Months)</Typography>
            <Line data={expiryData} options={{ maintainAspectRatio:false }} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p:3, height:380, borderRadius:3, border:'2px solid #e2e8f0' }}>
            <Typography variant="h6" fontWeight="bold">Stock Distribution</Typography>
            <Doughnut data={distData} options={{ maintainAspectRatio:false }} />
          </Paper>
        </Grid>

        {data.fefoList && <Grid item xs={12}>
          <Paper sx={{ borderRadius:3, border:'1px solid #e2e8f0', overflow:'hidden' }}>
            <div style={{display:'flex', alignItems:'center', padding:16, gap:8}}>
              <TrendingDown color="primary" />
              <div>
                <Typography variant="h6" fontWeight="bold">FEFO Priority List</Typography>
                <Typography fontSize={13} color="text.secondary">Sell these batches first (First Expiry First Out)</Typography>
              </div>
            </div>
            <Table>
              <TableHead sx={{ backgroundColor:'#f8fafc' }}>
                <TableRow>
                  {['Product Name','Batch','Quantity','Days to Expiry','Action'].map(h=><TableCell key={h}>{h}</TableCell>)}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.fefoList.map(item=>(
                  <TableRow key={item.id} hover>
                    <TableCell>{item.name}</TableCell>
                    <TableCell style={{ fontFamily:'monospace' }}>{item.batchNumber}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>
                      <Chip size="small" label={`${item.daysToExpiry} Days`} color={item.daysToExpiry<30?'warning':'success'} />
                    </TableCell>
                    <TableCell align="right" style={{cursor:'pointer', color:'#1976d2', fontWeight:600}}>Create Promotion</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>}
      </Grid>
    </div>
  );
};
export default Dashboard;
