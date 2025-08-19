const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createDemoUsers() {
  try {
    console.log('🚀 Creating demo users...');

    // Hash passwords
    const adminPassword = await bcrypt.hash('admin123', 10);
    const officerPassword = await bcrypt.hash('officer123', 10);
    const citizenPassword = await bcrypt.hash('citizen123', 10);

    // Create departments first
    const departments = await prisma.department.createMany({
      data: [
        {
          name: 'Immigration and Emigration',
          code: 'IMM',
          description: 'Passport and visa services'
        },
        {
          name: 'Department of Motor Traffic',
          code: 'DMT',
          description: 'Driving licenses and vehicle registration'
        },
        {
          name: 'Registrar General',
          code: 'RG',
          description: 'Birth, death, and marriage certificates'
        },
        {
          name: 'National Registration Department',
          code: 'NRD',
          description: 'National identity cards and registration'
        }
      ],
      skipDuplicates: true
    });

    const immDept = await prisma.department.findFirst({ where: { code: 'IMM' } });
    const dmtDept = await prisma.department.findFirst({ where: { code: 'DMT' } });

    // Create demo users
    await prisma.user.createMany({
      data: [
        {
          email: 'admin@gov.lk',
          passwordHash: adminPassword,
          fullName: 'System Administrator',
          nic: '751234567V',
          mobile: '+94775678901',
          role: 'ADMIN',
          isActive: true
        },
        {
          email: 'officer@gov.lk',
          passwordHash: officerPassword,
          fullName: 'Immigration Officer',
          nic: '801234567V',
          mobile: '+94773456789',
          role: 'OFFICER',
          departmentId: immDept?.id,
          isActive: true
        },
        {
          email: 'officer.dmt@gov.lk',
          passwordHash: officerPassword,
          fullName: 'DMT Officer',
          nic: '851234567V',
          mobile: '+94774567890',
          role: 'OFFICER',
          departmentId: dmtDept?.id,
          isActive: true
        },
        {
          email: 'citizen@gov.lk',
          passwordHash: citizenPassword,
          fullName: 'John Citizen',
          nic: '900123456V',
          mobile: '+94771234567',
          role: 'CITIZEN',
          isActive: true
        }
      ],
      skipDuplicates: true
    });

    console.log('✅ Demo users created successfully!');
    console.log('📋 Demo Accounts:');
    console.log('  Admin: admin@gov.lk / admin123');
    console.log('  Officer: officer@gov.lk / officer123');
    console.log('  Citizen: citizen@gov.lk / citizen123');

  } catch (error) {
    console.error('❌ Error creating demo users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createDemoUsers();
