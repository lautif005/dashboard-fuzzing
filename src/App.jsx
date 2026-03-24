import React from 'react';
import { 
  PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import './App.css';
import mockData from './data.json';

function App() {
  const scans = mockData.scans;
  const vulnerabilities = mockData.vulnerabilities;

  const totalScans = scans.length;
  const totalVulnerabilities = vulnerabilities.length;
  
  const criticalVulnerabilities = vulnerabilities.filter(
    (vuln) => vuln.severity === 'Critical'
  ).length;

  const severityCounts = vulnerabilities.reduce((acc, vuln) => {
    acc[vuln.severity] = (acc[vuln.severity] || 0) + 1;
    return acc;
  }, {});

  const severityData = Object.keys(severityCounts).map(key => ({
    name: key,
    value: severityCounts[key]
  }));

  // Conservamos tus colores aquí
  const CHART_COLORS = {
    Critical: '#ef4444',
    High: '#f97316',
    Medium: '#eab308',
    Low: '#3b82f6'
  };

  const trendData = [...scans]
    .sort((a, b) => new Date(a.scan_date) - new Date(b.scan_date))
    .map(scan => {
      const dateObj = new Date(scan.scan_date);
      return {
        fecha: `${dateObj.getDate()}/${dateObj.getMonth() + 1}`,
        vulnerabilidades: scan.total_vulnerabilities
      };
    });

  const endpointCounts = vulnerabilities.reduce((acc, vuln) => {
    acc[vuln.url] = (acc[vuln.url] || 0) + 1;
    return acc;
  }, {});

  const topEndpoints = Object.keys(endpointCounts)
    .map(url => ({ url, count: endpointCounts[url] }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard de Seguridad Web</h1>
        <p>Equipo Bot Azul - Monitoreo de Vulnerabilidades</p>
      </header>

      <section className="kpi-grid">
        <div className="kpi-card">
          <h3>Escaneos Realizados</h3>
          <p className="kpi-value">{totalScans}</p>
        </div>
        
        <div className="kpi-card">
          <h3>Total Vulnerabilidades</h3>
          <p className="kpi-value">{totalVulnerabilities}</p>
        </div>

        <div className="kpi-card critical">
          <h3>Vulnerabilidades Críticas</h3>
          <p className="kpi-value critical-text">
            {criticalVulnerabilities}
          </p>
        </div>
      </section>

      <section className="charts-grid">
        <div className="chart-card">
          <h3>Vulnerabilidades por Severidad</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={severityData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {severityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Evolución Histórica (Vulnerabilidades por Escaneo)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="fecha" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="vulnerabilidades" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ r: 5, fill: '#3b82f6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="tables-section">
        
        <div className="table-card">
          <h3>Endpoints Más Vulnerables</h3>
          <div className='table-wrapper'>
                <table className="data-table">
            <thead>
              <tr>
                <th>URL del Endpoint</th>
                <th>Cantidad de Fallos</th>
              </tr>
            </thead>
            <tbody>
              {topEndpoints.map((endpoint, index) => (
                <tr key={index}>
                  <td>{endpoint.url}</td>
                  <td>{endpoint.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>

        <div className="table-card">
          <h3>Detalle de Vulnerabilidades (Integración OWASP / CVSS)</h3>
          <div className='table-wrapper'>
              <table className="data-table">
            <thead>
              <tr>
                <th>Fuente</th>
                <th>Tipo</th>
                <th>Severidad</th>
                <th>CVSS</th>
                <th>OWASP Categoría</th>
                <th>URL Afectada</th>
              </tr>
            </thead>
            <tbody>
              {vulnerabilities.map((vuln) => (
                <tr key={vuln.id}>
                  <td>{vuln.source}</td>
                  <td>{vuln.type}</td>
                  <td>
                    <span className={`badge badge-${vuln.severity}`}>
                      {vuln.severity}
                    </span>
                  </td>
                  <td>{vuln.cvss_score}</td>
                  <td>{vuln.owasp_category}</td>
                  <td>{vuln.url}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>

      </section>
    </div>
  );
}

export default App;