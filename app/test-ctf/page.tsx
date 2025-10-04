// === METADATA ===
// Purpose: Render CTFTester and TerminalTester on a single test page
// Author: @Goodnbad.exe
// Inputs: None
// Outputs: UI page with both testers for manual validation
// Tests: npm run dev and visit /test-ctf to verify render
// Complexity: O(1) render; simple JSX composition
// === END METADATA ===
import CTFTester from '@/components/terminal/testing/CTFTester';
import TerminalTester from '@/components/terminal/testing/TerminalTester';

export default function TestCTFPage() {
  return (
    <div className="min-h-screen bg-black p-4 space-y-6">
      <CTFTester />
      <TerminalTester />
    </div>
  );
}