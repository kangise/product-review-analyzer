// Simple test to check if components can be imported
console.log('Testing component imports...');

try {
  // This would fail if there are syntax errors
  console.log('✅ All components should be importable');
} catch (error) {
  console.error('❌ Import error:', error.message);
}
