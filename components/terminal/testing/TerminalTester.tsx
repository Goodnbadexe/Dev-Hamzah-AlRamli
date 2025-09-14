'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TestCase {
  command: string;
  expectedOutput: string;
  description: string;
}

interface TestResult {
  command: string;
  expected: string;
  actual: string;
  passed: boolean;
  description: string;
}

const TerminalTester: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const testCases: TestCase[] = [
    {
      command: 'help',
      expectedOutput: 'Available commands:',
      description: 'Display help information'
    },
    {
      command: 'whoami',
      expectedOutput: 'guest',
      description: 'Show current user'
    },
    {
      command: 'ls',
      expectedOutput: 'Documents',
      description: 'List directory contents'
    },
    {
      command: 'pwd',
      expectedOutput: '/home/guest',
      description: 'Show current directory'
    },
    {
      command: 'date',
      expectedOutput: new Date().getFullYear().toString(),
      description: 'Display current date'
    },
    {
      command: 'clear',
      expectedOutput: '',
      description: 'Clear terminal screen'
    },
    {
      command: 'ctf list',
      expectedOutput: 'Available CTF Challenges:',
      description: 'List CTF challenges'
    },
    {
      command: 'scan localhost',
      expectedOutput: 'Scanning target:',
      description: 'Network scan command'
    },
    {
      command: 'hash md5 test',
      expectedOutput: '098f6bcd4621d373cade4e832627b4f6',
      description: 'MD5 hash generation'
    },
    {
      command: 'matrix',
      expectedOutput: 'Entering the Matrix',
      description: 'Matrix easter egg'
    }
  ];

  const testCTFCommands = async () => {
    setIsRunning(true);
    const results: TestResult[] = [];

    for (const testCase of testCases) {
      // Simulate command execution
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Mock the command execution result
      let actualOutput = '';
      let passed = false;

      switch (testCase.command) {
        case 'help':
          actualOutput = 'Available commands: help, whoami, ls, pwd, date, clear, ctf, scan, hash, matrix';
          passed = actualOutput.includes(testCase.expectedOutput);
          break;
        case 'whoami':
          actualOutput = 'guest';
          passed = actualOutput === testCase.expectedOutput;
          break;
        case 'ls':
          actualOutput = 'Documents  Downloads  Pictures  Videos';
          passed = actualOutput.includes(testCase.expectedOutput);
          break;
        case 'pwd':
          actualOutput = '/home/guest';
          passed = actualOutput === testCase.expectedOutput;
          break;
        case 'date':
          actualOutput = new Date().toString();
          passed = actualOutput.includes(testCase.expectedOutput);
          break;
        case 'clear':
          actualOutput = 'Terminal cleared';
          passed = true;
          break;
        case 'ctf list':
          actualOutput = 'Available CTF Challenges:\n1. Welcome to the Matrix (10 pts)\n2. Caesar\'s Secret (15 pts)';
          passed = actualOutput.includes(testCase.expectedOutput);
          break;
        case 'scan localhost':
          actualOutput = 'Scanning target: localhost\nPort 22: Open (SSH)\nPort 80: Open (HTTP)';
          passed = actualOutput.includes(testCase.expectedOutput);
          break;
        case 'hash md5 test':
          actualOutput = '098f6bcd4621d373cade4e832627b4f6';
          passed = actualOutput === testCase.expectedOutput;
          break;
        case 'matrix':
          actualOutput = 'Entering the Matrix... Wake up, Neo.';
          passed = actualOutput.includes(testCase.expectedOutput);
          break;
        default:
          actualOutput = 'Command not found';
          passed = false;
      }

      const result: TestResult = {
        command: testCase.command,
        expected: testCase.expectedOutput,
        actual: actualOutput,
        passed: passed,
        description: testCase.description
      };

      results.push(result);
      setTestResults([...results]);
    }

    setIsRunning(false);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const passedTests = testResults.filter(r => r.passed).length;
  const totalTests = testResults.length;
  const successRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-green-400">
            🖥️ Terminal Command Tester
          </CardTitle>
          {testResults.length > 0 && (
            <div className="flex items-center gap-4 mt-4">
              <div className="text-lg">
                <span className="text-green-400 font-bold">{passedTests}</span>
                <span className="text-gray-400"> / </span>
                <span className="text-blue-400 font-bold">{totalTests}</span>
                <span className="text-gray-400 ml-2">tests passed</span>
              </div>
              <div className="flex-1 bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${successRate}%` }}
                />
              </div>
              <span className="text-sm text-gray-400">{successRate.toFixed(1)}%</span>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button 
              onClick={testCTFCommands} 
              disabled={isRunning}
              className="bg-green-600 hover:bg-green-700"
            >
              {isRunning ? 'Running Tests...' : 'Run Terminal Tests'}
            </Button>
            <Button 
              onClick={clearResults} 
              variant="outline"
              disabled={isRunning}
            >
              Clear Results
            </Button>
          </div>
        </CardContent>
      </Card>

      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-blue-400">
              📊 Test Results ({testResults.length} tests)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg border ${
                    result.passed 
                      ? 'border-green-500 bg-green-900/20' 
                      : 'border-red-500 bg-red-900/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className={`text-lg ${
                        result.passed ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {result.passed ? '✅' : '❌'}
                      </span>
                      <code className="text-yellow-300 bg-gray-800 px-2 py-1 rounded">
                        {result.command}
                      </code>
                      <Badge variant="outline" className="text-gray-400">
                        {result.description}
                      </Badge>
                    </div>
                  </div>
                  <div className="ml-8 space-y-1 text-sm">
                    <div>
                      <span className="text-gray-400">Expected:</span>
                      <span className="text-green-300 ml-2">{result.expected}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Actual:</span>
                      <span className={`ml-2 ${
                        result.passed ? 'text-green-300' : 'text-red-300'
                      }`}>
                        {result.actual}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TerminalTester;