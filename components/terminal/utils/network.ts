// Network utility functions for the hacker terminal

// Simulate getting public IP (in a real app, you'd call an API)
export async function getPublicIP(): Promise<string> {
  try {
    // In a real implementation, you'd call an API like:
    // const response = await fetch('https://api.ipify.org?format=json');
    // const data = await response.json();
    // return data.ip;
    
    // For demo purposes, we'll simulate this
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    
    // Generate a realistic-looking IP for demo
    const ip = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    return ip;
  } catch (error) {
    throw new Error('Failed to retrieve IP address');
  }
}

// Generate fake hash for demonstration
export function generateFakeHash(input: string, algorithm: string = 'md5'): string {
  // This is just for demonstration - in a real app, use proper crypto libraries
  let hash = '';
  const chars = '0123456789abcdef';
  
  // Simple hash simulation based on input
  let seed = 0;
  for (let i = 0; i < input.length; i++) {
    seed += input.charCodeAt(i);
  }
  
  const length = algorithm === 'md5' ? 32 : algorithm === 'sha1' ? 40 : 64;
  
  for (let i = 0; i < length; i++) {
    hash += chars[Math.floor((seed * (i + 1)) % 16)];
  }
  
  return hash;
}

// Simulate network scanning
export async function simulateNetworkScan(target: string): Promise<string> {
  const scanSteps = [
    '🔍 Initializing network scanner...',
    `🎯 Target: ${target}`,
    '📡 Performing host discovery...',
    '🔎 Scanning common ports...',
    '⚡ Analyzing services...',
    '📊 Generating report...'
  ];
  
  let output = '🚀 NETWORK RECONNAISSANCE INITIATED\n\n';
  
  // Simulate scanning progress
  for (const step of scanSteps) {
    output += step + '\n';
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Generate fake scan results
  const commonPorts = [
    { port: 22, service: 'SSH', status: 'open' },
    { port: 80, service: 'HTTP', status: 'open' },
    { port: 443, service: 'HTTPS', status: 'open' },
    { port: 21, service: 'FTP', status: 'filtered' },
    { port: 25, service: 'SMTP', status: 'closed' },
    { port: 3389, service: 'RDP', status: 'closed' }
  ];
  
  output += '\n📋 SCAN RESULTS:\n';
  output += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
  output += 'PORT     SERVICE    STATUS\n';
  output += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
  
  commonPorts.forEach(({ port, service, status }) => {
    const statusIcon = status === 'open' ? '🟢' : status === 'filtered' ? '🟡' : '🔴';
    output += `${port.toString().padEnd(8)} ${service.padEnd(10)} ${statusIcon} ${status}\n`;
  });
  
  output += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
  output += `\n🎯 Scan completed for ${target}`;
  output += '\n⚠️  Remember: Only scan systems you own or have permission to test!';
  
  return output;
}

// Simulate DNS lookup
export async function simulateDNSLookup(domain: string): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const fakeIPs = [
    '93.184.216.34',
    '151.101.193.140',
    '172.217.12.142',
    '13.107.42.14'
  ];
  
  const ip = fakeIPs[Math.floor(Math.random() * fakeIPs.length)];
  
  return `🌐 DNS Lookup Results for ${domain}:\n\nA Record: ${ip}\nMX Record: mail.${domain}\nNS Record: ns1.${domain}, ns2.${domain}\n\n✅ DNS resolution successful!`;
}

// Simulate traceroute
export async function simulateTraceroute(target: string): Promise<string> {
  let output = `🛣️  TRACEROUTE TO ${target}\n\n`;
  
  const hops = [
    { hop: 1, ip: '192.168.1.1', hostname: 'router.local', time: '1.234ms' },
    { hop: 2, ip: '10.0.0.1', hostname: 'isp-gateway.net', time: '12.456ms' },
    { hop: 3, ip: '203.0.113.1', hostname: 'backbone1.isp.com', time: '23.789ms' },
    { hop: 4, ip: '198.51.100.1', hostname: 'core-router.net', time: '45.123ms' },
    { hop: 5, ip: '93.184.216.34', hostname: target, time: '67.890ms' }
  ];
  
  output += 'HOP  IP ADDRESS      HOSTNAME              TIME\n';
  output += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
  
  for (const hop of hops) {
    await new Promise(resolve => setTimeout(resolve, 300));
    output += `${hop.hop.toString().padEnd(4)} ${hop.ip.padEnd(15)} ${hop.hostname.padEnd(20)} ${hop.time}\n`;
  }
  
  output += '\n🎯 Traceroute completed successfully!';
  return output;
}

// Simulate port scanning with progress
export async function simulatePortScan(target: string, startPort: number = 1, endPort: number = 1000): Promise<string> {
  let output = `🔍 PORT SCAN: ${target} (${startPort}-${endPort})\n\n`;
  
  const openPorts = [22, 80, 443, 8080, 3000, 5432];
  const scannedPorts = Math.min(endPort - startPort + 1, 50); // Limit for demo
  
  output += '⚡ Scanning in progress...\n\n';
  
  let foundPorts = 0;
  for (let i = 0; i < scannedPorts; i++) {
    const port = startPort + i;
    if (openPorts.includes(port)) {
      output += `🟢 Port ${port}: OPEN\n`;
      foundPorts++;
    }
    
    if (i % 10 === 0) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  output += `\n📊 Scan Summary:\n`;
  output += `• Ports scanned: ${scannedPorts}\n`;
  output += `• Open ports found: ${foundPorts}\n`;
  output += `• Scan duration: ${(scannedPorts * 0.1).toFixed(1)}s\n`;
  
  return output;
}

// Get geolocation info (simulated)
export async function getGeoLocation(ip: string): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  const locations = [
    { country: 'United States', city: 'New York', region: 'NY', isp: 'CloudFlare Inc.' },
    { country: 'Germany', city: 'Frankfurt', region: 'HE', isp: 'Deutsche Telekom AG' },
    { country: 'Japan', city: 'Tokyo', region: 'Tokyo', isp: 'NTT Communications' },
    { country: 'United Kingdom', city: 'London', region: 'England', isp: 'British Telecom' }
  ];
  
  const location = locations[Math.floor(Math.random() * locations.length)];
  
  return `🌍 GEOLOCATION INFO FOR ${ip}:\n\n` +
         `🏳️  Country: ${location.country}\n` +
         `🏙️  City: ${location.city}\n` +
         `📍 Region: ${location.region}\n` +
         `🌐 ISP: ${location.isp}\n\n` +
         `⚠️  Note: This is simulated data for demonstration purposes.`;
}

// Check if a service is running (simulated)
export async function checkService(host: string, port: number): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const services = {
    22: 'SSH',
    80: 'HTTP',
    443: 'HTTPS',
    21: 'FTP',
    25: 'SMTP',
    53: 'DNS',
    3389: 'RDP'
  };
  
  const serviceName = services[port as keyof typeof services] || 'Unknown';
  const isOpen = Math.random() > 0.3; // 70% chance of being open
  
  if (isOpen) {
    return `✅ ${host}:${port} - ${serviceName} service is RUNNING\n\n🔍 Service appears to be accessible and responding to connections.`;
  } else {
    return `❌ ${host}:${port} - ${serviceName} service is NOT ACCESSIBLE\n\n🚫 Port is closed, filtered, or service is not running.`;
  }
}