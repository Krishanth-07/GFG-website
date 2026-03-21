import React, { useEffect, useMemo, useState } from 'react';
import { Code2, BookOpen, Terminal, ExternalLink, Rocket, Bookmark, Play, RotateCcw, CheckCircle2, XCircle, Beaker } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/themes/prism-tomorrow.css';

const RESOURCE_STORAGE_KEY = 'gfg_resource_bookmarks_v1';
const SUBMISSION_STORAGE_PREFIX = 'gfg_problem_submissions_v1';
const LANGUAGE_OPTIONS = ['JavaScript', 'Python', 'C++', 'Java'];
const PRISM_LANGUAGE_MAP = {
  JavaScript: 'javascript',
  Python: 'python',
  'C++': 'cpp',
  Java: 'java',
};

const getSubmissionStorageKey = (userId) => `${SUBMISSION_STORAGE_PREFIX}_${userId || 'guest'}`;

const normalizeOutput = (value) => String(value ?? '').replace(/\r\n/g, '\n').trim();

const highlightCode = (code, selectedLanguage) => {
  try {
    const lang = PRISM_LANGUAGE_MAP[selectedLanguage] || 'javascript';
    const grammar = Prism.languages[lang] || Prism.languages.javascript || Prism.languages.clike;
    if (!grammar) return code;
    return Prism.highlight(code, grammar, lang);
  } catch {
    return code;
  }
};

const problemLanguageStarters = {
  'sum-two': {
  Python: `import sys

def solve(a, b):
  return a + b

data = sys.stdin.read().strip().split()
a = int(data[0]) if len(data) > 0 else 0
b = int(data[1]) if len(data) > 1 else 0
print(solve(a, b))`,
  'C++': `#include <bits/stdc++.h>
using namespace std;

long long solve(long long a, long long b) {
  return a + b;
}

int main() {
  ios::sync_with_stdio(false);
  cin.tie(nullptr);

  long long a = 0, b = 0;
  cin >> a >> b;
  cout << solve(a, b);
  return 0;
}`,
  Java: `import java.util.*;

public class Main {
  static long solve(long a, long b) {
    return a + b;
  }

  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    long a = sc.hasNextLong() ? sc.nextLong() : 0L;
    long b = sc.hasNextLong() ? sc.nextLong() : 0L;
    System.out.print(solve(a, b));
  }
}`,
  },
  'max-array': {
  Python: `import sys

def solve(arr):
  return max(arr) if arr else 0

data = list(map(int, sys.stdin.read().strip().split()))
n = data[0] if data else 0
arr = data[1:1 + n]
print(solve(arr))`,
  'C++': `#include <bits/stdc++.h>
using namespace std;

int solve(const vector<int>& arr) {
  return arr.empty() ? 0 : *max_element(arr.begin(), arr.end());
}

int main() {
  ios::sync_with_stdio(false);
  cin.tie(nullptr);

  int n = 0;
  cin >> n;
  vector<int> arr(n);
  for (int i = 0; i < n; i++) cin >> arr[i];
  cout << solve(arr);
  return 0;
}`,
  Java: `import java.util.*;

public class Main {
  static int solve(int[] arr) {
    int max = arr.length > 0 ? arr[0] : 0;
    for (int x : arr) max = Math.max(max, x);
    return max;
  }

  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    int n = sc.hasNextInt() ? sc.nextInt() : 0;
    int[] arr = new int[n];
    for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
    System.out.print(solve(arr));
  }
}`,
  },
  palindrome: {
  Python: `import sys

def solve(s):
  i, j = 0, len(s) - 1
  while i < j:
    while i < j and not s[i].isalnum():
      i += 1
    while i < j and not s[j].isalnum():
      j -= 1
    if s[i].lower() != s[j].lower():
      return False
    i += 1
    j -= 1
  return True

s = sys.stdin.read().rstrip('\n')
print(str(solve(s)).lower())`,
  'C++': `#include <bits/stdc++.h>
using namespace std;

bool solve(const string& s) {
  int i = 0, j = (int)s.size() - 1;
  while (i < j) {
    while (i < j && !isalnum((unsigned char)s[i])) i++;
    while (i < j && !isalnum((unsigned char)s[j])) j--;
    if (tolower((unsigned char)s[i]) != tolower((unsigned char)s[j])) return false;
    i++;
    j--;
  }
  return true;
}

int main() {
  ios::sync_with_stdio(false);
  cin.tie(nullptr);

  string s((istreambuf_iterator<char>(cin)), istreambuf_iterator<char>());
  if (!s.empty() && s.back() == '\n') s.pop_back();
  cout << (solve(s) ? "true" : "false");
  return 0;
}`,
  Java: `import java.io.*;

public class Main {
  static boolean solve(String s) {
    int i = 0, j = s.length() - 1;
    while (i < j) {
      while (i < j && !Character.isLetterOrDigit(s.charAt(i))) i++;
      while (i < j && !Character.isLetterOrDigit(s.charAt(j))) j--;
      if (Character.toLowerCase(s.charAt(i)) != Character.toLowerCase(s.charAt(j))) return false;
      i++;
      j--;
    }
    return true;
  }

  public static void main(String[] args) throws Exception {
    BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
    StringBuilder sb = new StringBuilder();
    String line;
    boolean first = true;
    while ((line = br.readLine()) != null) {
      if (!first) sb.append('\n');
      sb.append(line);
      first = false;
    }
    System.out.print(solve(sb.toString()) ? "true" : "false");
  }
}`,
  },
  'first-unique': {
  Python: `import sys
from collections import Counter

def solve(s):
  freq = Counter(s)
  for ch in s:
    if freq[ch] == 1:
      return ch
  return ''

s = sys.stdin.read().rstrip('\n')
print(solve(s))`,
  'C++': `#include <bits/stdc++.h>
using namespace std;

string solve(const string& s) {
  vector<int> freq(256, 0);
  for (unsigned char ch : s) freq[ch]++;
  for (char ch : s) if (freq[(unsigned char)ch] == 1) return string(1, ch);
  return "";
}

int main() {
  ios::sync_with_stdio(false);
  cin.tie(nullptr);

  string s((istreambuf_iterator<char>(cin)), istreambuf_iterator<char>());
  if (!s.empty() && s.back() == '\n') s.pop_back();
  cout << solve(s);
  return 0;
}`,
  Java: `import java.io.*;

public class Main {
  static String solve(String s) {
    int[] freq = new int[256];
    for (int i = 0; i < s.length(); i++) freq[s.charAt(i)]++;
    for (int i = 0; i < s.length(); i++) {
      if (freq[s.charAt(i)] == 1) return String.valueOf(s.charAt(i));
    }
    return "";
  }

  public static void main(String[] args) throws Exception {
    BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
    StringBuilder sb = new StringBuilder();
    String line;
    boolean first = true;
    while ((line = br.readLine()) != null) {
      if (!first) sb.append('\n');
      sb.append(line);
      first = false;
    }
    System.out.print(solve(sb.toString()));
  }
}`,
  },
  'climb-stairs': {
  Python: `import sys

def solve(n):
  if n <= 2:
    return n
  a, b = 1, 2
  for _ in range(3, n + 1):
    a, b = b, a + b
  return b

n = int((sys.stdin.read().strip() or '0'))
print(solve(n))`,
  'C++': `#include <bits/stdc++.h>
using namespace std;

int solve(int n) {
  if (n <= 2) return n;
  int a = 1, b = 2;
  for (int i = 3; i <= n; i++) {
    int c = a + b;
    a = b;
    b = c;
  }
  return b;
}

int main() {
  ios::sync_with_stdio(false);
  cin.tie(nullptr);

  int n = 0;
  cin >> n;
  cout << solve(n);
  return 0;
}`,
  Java: `import java.util.*;

public class Main {
  static int solve(int n) {
    if (n <= 2) return n;
    int a = 1, b = 2;
    for (int i = 3; i <= n; i++) {
      int c = a + b;
      a = b;
      b = c;
    }
    return b;
  }

  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    int n = sc.hasNextInt() ? sc.nextInt() : 0;
    System.out.print(solve(n));
  }
}`,
  },
  'merge-intervals': {
  Python: `import sys

def solve(intervals):
  intervals.sort()
  merged = []
  for s, e in intervals:
    if not merged or merged[-1][1] < s:
      merged.append([s, e])
    else:
      merged[-1][1] = max(merged[-1][1], e)
  return merged

data = list(map(int, sys.stdin.read().strip().split()))
n = data[0] if data else 0
vals = data[1:]
intervals = []
for i in range(0, min(len(vals), n * 2), 2):
  intervals.append([vals[i], vals[i + 1]])

for s, e in solve(intervals):
  print(f"{s} {e}")`,
  'C++': `#include <bits/stdc++.h>
using namespace std;

vector<pair<int, int>> solve(vector<pair<int, int>> intervals) {
  sort(intervals.begin(), intervals.end());
  vector<pair<int, int>> merged;
  for (auto [s, e] : intervals) {
    if (merged.empty() || merged.back().second < s) {
      merged.push_back({s, e});
    } else {
      merged.back().second = max(merged.back().second, e);
    }
  }
  return merged;
}

int main() {
  ios::sync_with_stdio(false);
  cin.tie(nullptr);

  int n = 0;
  cin >> n;
  vector<pair<int, int>> intervals;
  for (int i = 0; i < n; i++) {
    int s, e;
    cin >> s >> e;
    intervals.push_back({s, e});
  }

  auto ans = solve(intervals);
  for (size_t i = 0; i < ans.size(); i++) {
    cout << ans[i].first << ' ' << ans[i].second;
    if (i + 1 < ans.size()) cout << '\n';
  }
  return 0;
}`,
  Java: `import java.util.*;

public class Main {
  static List<int[]> solve(List<int[]> intervals) {
    intervals.sort((a, b) -> Integer.compare(a[0], b[0]));
    List<int[]> merged = new ArrayList<>();
    for (int[] cur : intervals) {
      if (merged.isEmpty() || merged.get(merged.size() - 1)[1] < cur[0]) {
        merged.add(new int[]{cur[0], cur[1]});
      } else {
        merged.get(merged.size() - 1)[1] = Math.max(merged.get(merged.size() - 1)[1], cur[1]);
      }
    }
    return merged;
  }

  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    int n = sc.hasNextInt() ? sc.nextInt() : 0;
    List<int[]> intervals = new ArrayList<>();
    for (int i = 0; i < n; i++) {
      int s = sc.nextInt();
      int e = sc.nextInt();
      intervals.add(new int[]{s, e});
    }
    List<int[]> ans = solve(intervals);
    for (int i = 0; i < ans.size(); i++) {
      System.out.print(ans.get(i)[0] + " " + ans.get(i)[1]);
      if (i + 1 < ans.size()) System.out.print("\n");
    }
  }
}`,
  },
};

const makeLanguageStarter = (problem, language) => {
  const customStarter = problemLanguageStarters[problem.id]?.[language];
  if (customStarter) return customStarter;

  if (language === 'JavaScript') {
    return `function solve() {
  // Write your code here
  return 'Hello, World!';
}

console.log(solve());`;
  }

  if (language === 'Python') {
    return `def ${problem.functionName}(*args):\n    # Write your code here\n    return None`;
  }

  if (language === 'C++') {
    return `#include <bits/stdc++.h>\nusing namespace std;\n\n// Implement your logic in solve()\nint main() {\n    // Read input and print output\n    return 0;\n}`;
  }

  return `public class Solution {\n    // Implement your logic here\n    public static void main(String[] args) {\n    }\n}`;
};

const problemBank = [
  {
    id: 'sum-two',
    title: 'Sum of Two Numbers',
    level: 'Easy',
    statement: 'Return the sum of two integers a and b.',
    hint: 'Start with direct arithmetic. No loops or conditionals are required.',
    editorial: 'The optimal solution is O(1): simply return a + b.',
    functionName: 'solve',
    starterCode: `function solve(a, b) {
  // Write your code here
  return 0;
}`,
    tests: [
      { input: [2, 5], expected: 7 },
      { input: [-3, 10], expected: 7 },
      { input: [0, 0], expected: 0 },
    ],
    ioTests: [
      { input: '2 5', expected: '7' },
      { input: '-3 10', expected: '7' },
      { input: '0 0', expected: '0' },
    ],
  },
  {
    id: 'max-array',
    title: 'Maximum In Array',
    level: 'Easy',
    statement: 'Given an array of integers, return the maximum value.',
    hint: 'Track a running maximum while scanning the array once.',
    editorial: 'Initialize max with the first value and update when a bigger value appears. Time O(n), space O(1).',
    functionName: 'solve',
    starterCode: `function solve(arr) {
  // Write your code here
  return -1;
}`,
    tests: [
      { input: [[1, 4, 2, 9, 3]], expected: 9 },
      { input: [[-5, -1, -9]], expected: -1 },
      { input: [[7]], expected: 7 },
    ],
    ioTests: [
      { input: '5\n1 4 2 9 3', expected: '9' },
      { input: '3\n-5 -1 -9', expected: '-1' },
      { input: '1\n7', expected: '7' },
    ],
  },
  {
    id: 'palindrome',
    title: 'Valid Palindrome',
    level: 'Medium',
    statement: 'Return true if string s is a palindrome after converting to lowercase and removing non-alphanumeric characters.',
    hint: 'Use two pointers from both ends, skipping non-alphanumeric chars.',
    editorial: 'Normalize checks in-place with two pointers. Compare lowercase chars and move inward. Time O(n), space O(1).',
    functionName: 'solve',
    starterCode: `function solve(s) {
  // Write your code here
  return false;
}`,
    tests: [
      { input: ['A man, a plan, a canal: Panama'], expected: true },
      { input: ['race a car'], expected: false },
      { input: [' '], expected: true },
    ],
    ioTests: [
      { input: 'A man, a plan, a canal: Panama', expected: 'true' },
      { input: 'race a car', expected: 'false' },
      { input: ' ', expected: 'true' },
    ],
  },
  {
    id: 'first-unique',
    title: 'First Non-Repeating Character',
    level: 'Medium',
    statement: 'Return the first non-repeating character in s. If none exists, return an empty string.',
    hint: 'Count character frequency first, then scan again for the first count of 1.',
    editorial: 'Two-pass hash map approach: pass one stores counts, pass two returns first unique character. Time O(n), space O(k).',
    functionName: 'solve',
    starterCode: `function solve(s) {
  // Write your code here
  return '';
}`,
    tests: [
      { input: ['leetcode'], expected: 'l' },
      { input: ['aabb'], expected: '' },
      { input: ['swiss'], expected: 'w' },
    ],
    ioTests: [
      { input: 'leetcode', expected: 'l' },
      { input: 'aabb', expected: '' },
      { input: 'swiss', expected: 'w' },
    ],
  },
  {
    id: 'climb-stairs',
    title: 'Climbing Stairs',
    level: 'Hard',
    statement: 'You can climb 1 or 2 steps. Return the number of distinct ways to reach step n.',
    hint: 'Think Fibonacci: ways(n) = ways(n-1) + ways(n-2).',
    editorial: 'Dynamic programming with two rolling values gives O(n) time and O(1) extra space.',
    functionName: 'solve',
    starterCode: `function solve(n) {
  // Write your code here
  return 0;
}`,
    tests: [
      { input: [2], expected: 2 },
      { input: [3], expected: 3 },
      { input: [5], expected: 8 },
    ],
    ioTests: [
      { input: '2', expected: '2' },
      { input: '3', expected: '3' },
      { input: '5', expected: '8' },
    ],
  },
  {
    id: 'merge-intervals',
    title: 'Merge Intervals',
    level: 'Hard',
    statement: 'Given intervals [start, end], merge all overlapping intervals and return the merged list.',
    hint: 'Sort by interval start before merging.',
    editorial: 'After sorting, keep a result list and merge with the last interval when overlapping. Time O(n log n) due to sorting.',
    functionName: 'solve',
    starterCode: `function solve(intervals) {
  // Write your code here
  return [];
}`,
    tests: [
      { input: [[[1, 3], [2, 6], [8, 10], [15, 18]]], expected: [[1, 6], [8, 10], [15, 18]] },
      { input: [[[1, 4], [4, 5]]], expected: [[1, 5]] },
      { input: [[[1, 2], [6, 7], [3, 5]]], expected: [[1, 2], [3, 5], [6, 7]] },
    ],
    ioTests: [
      { input: '4\n1 3\n2 6\n8 10\n15 18', expected: '1 6\n8 10\n15 18' },
      { input: '2\n1 4\n4 5', expected: '1 5' },
      { input: '3\n1 2\n6 7\n3 5', expected: '1 2\n3 5\n6 7' },
    ],
  },
];

const runCodeOnLocalService = async ({ language, code, timeout = 45000 }) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch('/api/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({ language, code }),
    });

    const data = await response.json();
    if (!response.ok) {
      return { ok: false, error: data?.error || `Execution service error (${response.status}).` };
    }

    return { ok: true, output: data?.output ?? '' };
  } catch (error) {
    if (error?.name === 'AbortError') {
      return { ok: false, error: 'Execution timed out. Java/C++ may need more time on first run or missing local toolchain.' };
    }
    return { ok: false, error: 'Compiler service is unavailable. Ensure Vite dev server is running.' };
  } finally {
    clearTimeout(timer);
  }
};

const resourceCategories = [
  {
    title: 'Data Structures & Algorithms',
    icon: <Code2 size={24} />,
    color: 'text-gfg-green',
    bgColor: 'bg-gfg-green/10',
    borderColor: 'border-gfg-green/30',
    links: [
      {
        name: 'GfG DSA Self Paced',
        url: 'https://www.geeksforgeeks.org/courses/dsa-self-paced',
        desc: 'Comprehensive structured guide to DSA',
      },
      {
        name: 'LeetCode Top 100',
        url: 'https://leetcode.com/problem-list/top-topics',
        desc: 'Most frequently-asked interview questions',
      },
      {
        name: 'NeetCode 150',
        url: 'https://neetcode.io/roadmap',
        desc: 'Curated roadmap for problem solving',
      },
    ]
  },
  {
    title: 'Web Development',
    icon: <Terminal size={24} />,
    color: 'text-gfg-blue',
    bgColor: 'bg-gfg-blue/10',
    borderColor: 'border-gfg-blue/30',
    links: [
      {
        name: 'freeCodeCamp',
        url: 'https://www.freecodecamp.org/learn',
        desc: 'Interactive full-stack web dev curriculum',
      },
      {
        name: 'MDN Web Docs',
        url: 'https://developer.mozilla.org/',
        desc: 'The definitive web platform reference',
      },
      {
        name: 'React Documentation',
        url: 'https://react.dev/learn',
        desc: 'Official React docs and interactive tutorials',
      },
    ]
  },
  {
    title: 'Competitive Programming',
    icon: <BookOpen size={24} />,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    links: [
      {
        name: 'Codeforces',
        url: 'https://codeforces.com/',
        desc: 'Regular contests and a huge problemset',
      },
      {
        name: 'CodeChef',
        url: 'https://www.codechef.com/',
        desc: 'Monthly long challenges and cook-offs',
      },
      {
        name: 'CSES Problem Set',
        url: 'https://cses.fi/problemset/',
        desc: 'Standard algorithmic tasks with editorials',
      },
    ]
  }
];

const Resources = ({ ideOnly = false }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('JavaScript');
  const [selectedProblemId, setSelectedProblemId] = useState(problemBank[0].id);
  const [editorCode, setEditorCode] = useState(problemBank[0].starterCode);
  const [isRunning, setIsRunning] = useState(false);
  const [runFeedback, setRunFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [showEditorial, setShowEditorial] = useState(false);
  const [submissionHistory, setSubmissionHistory] = useState([]);
  const [bookmarks, setBookmarks] = useState(() => {
    if (typeof window === 'undefined') return {};
    try {
      const raw = window.localStorage.getItem(RESOURCE_STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const categories = useMemo(() => ['All', ...resourceCategories.map((c) => c.title)], []);

  const filteredCategories = useMemo(() => {
    const q = query.trim().toLowerCase();
    return resourceCategories
      .filter((category) => selectedCategory === 'All' || category.title === selectedCategory)
      .map((category) => ({
        ...category,
        links: category.links.filter((link) => {
          if (!q) return true;
          return (
            link.name.toLowerCase().includes(q) ||
            link.desc.toLowerCase().includes(q) ||
            category.title.toLowerCase().includes(q)
          );
        }),
      }))
      .filter((category) => category.links.length > 0);
  }, [query, selectedCategory]);

  const bookmarkCount = useMemo(() => Object.values(bookmarks).filter(Boolean).length, [bookmarks]);

  const levels = useMemo(() => ['All', 'Easy', 'Medium', 'Hard'], []);

  const filteredProblems = useMemo(() => {
    return problemBank.filter((problem) => selectedLevel === 'All' || problem.level === selectedLevel);
  }, [selectedLevel]);

  const selectedProblem = useMemo(() => {
    return filteredProblems.find((problem) => problem.id === selectedProblemId) || filteredProblems[0] || problemBank[0];
  }, [filteredProblems, selectedProblemId]);

  const solvedProblemCount = useMemo(() => {
    const accepted = new Set(
      submissionHistory
        .filter((entry) => entry.status === 'Success')
        .map((entry) => entry.problemId)
    );
    return accepted.size;
  }, [submissionHistory]);

  const solvedPercent = useMemo(() => {
    if (problemBank.length === 0) return 0;
    return Math.round((solvedProblemCount / problemBank.length) * 100);
  }, [solvedProblemCount]);

  useEffect(() => {
    if (!selectedProblem) return;
    if (selectedProblem.id !== selectedProblemId) {
      setSelectedProblemId(selectedProblem.id);
      return;
    }
    setEditorCode(makeLanguageStarter(selectedProblem, selectedLanguage));
    setRunFeedback(null);
    setShowHint(false);
    setShowEditorial(false);
  }, [selectedProblem, selectedProblemId, selectedLanguage]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storageKey = getSubmissionStorageKey(currentUser?.id);
    try {
      const raw = window.localStorage.getItem(storageKey);
      setSubmissionHistory(raw ? JSON.parse(raw) : []);
    } catch {
      setSubmissionHistory([]);
    }
  }, [currentUser?.id]);

  const toggleBookmark = (linkName) => {
    setBookmarks((prev) => {
      const next = { ...prev, [linkName]: !prev[linkName] };
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(RESOURCE_STORAGE_KEY, JSON.stringify(next));
      }
      return next;
    });
  };

  const resetCode = () => {
    setEditorCode(makeLanguageStarter(selectedProblem, selectedLanguage));
    setRunFeedback(null);
  };

  const saveSubmission = (entry) => {
    const nextHistory = [entry, ...submissionHistory].slice(0, 20);
    setSubmissionHistory(nextHistory);

    if (typeof window !== 'undefined') {
      const storageKey = getSubmissionStorageKey(currentUser?.id);
      window.localStorage.setItem(storageKey, JSON.stringify(nextHistory));
    }
  };

  const goToProblemSolving = () => navigate('/resources/problem-solving');

  const runCode = async () => {
    setIsRunning(true);
    setRunFeedback(null);
    const result = await runCodeOnLocalService({
      language: selectedLanguage,
      code: editorCode,
      timeout:
        selectedLanguage === 'Java'
          ? 60000
          : selectedLanguage === 'C++'
            ? 60000
            : selectedLanguage === 'Python'
              ? 45000
              : 45000,
    });

    setIsRunning(false);
    if (result.ok) {
      setRunFeedback({ ok: true, output: normalizeOutput(result.output) || '(no output)' });
    } else {
      setRunFeedback({ ok: false, error: result.error });
    }

    if (result.ok) {
      saveSubmission({
        problemId: selectedProblem.id,
        title: selectedProblem.title,
        language: selectedLanguage,
        passed: 1,
        total: 1,
        status: 'Success',
        createdAt: new Date().toISOString(),
      });
    } else {
      saveSubmission({
        problemId: selectedProblem.id,
        title: selectedProblem.title,
        language: selectedLanguage,
        passed: 0,
        total: 1,
        status: 'Error',
        createdAt: new Date().toISOString(),
      });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-comic-yellow)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {!ideOnly && (
        <div className="mb-10 rounded-[2rem] border-[3px] border-black bg-[var(--color-comic-cream)] p-8 shadow-[8px_8px_0_#000]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="display-comic text-4xl md:text-5xl">Resource Hangar</h1>
              <p className="mt-3 max-w-3xl text-lg font-extrabold text-black/85">
                Launch with curated learning stacks for DSA, Web Development, and Competitive Programming.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={goToProblemSolving}
                className="comic-outline-soft inline-flex items-center gap-2 rounded-xl bg-[var(--color-comic-red)] px-4 py-3 text-xs font-black uppercase text-white"
              >
                <Code2 size={16} />
                Problem Solving
              </button>
              <div className="comic-outline-soft inline-flex items-center gap-2 rounded-xl bg-[var(--color-comic-orange)] px-4 py-3 text-white">
                <Rocket size={18} />
                <span className="font-black">{bookmarkCount} bookmarked</span>
              </div>
            </div>
          </div>
        </div>
        )}

        {!ideOnly && (
        <div className="mb-6 grid gap-3 rounded-2xl border-[3px] border-black bg-[var(--color-comic-cream)] p-4 md:grid-cols-[1fr_auto]">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search resources"
            className="rounded-xl border-[3px] border-black bg-white px-4 py-3 text-sm font-bold text-black focus:outline-none"
          />
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-xl border-[2px] border-black px-3 py-2 text-xs font-black uppercase ${
                  selectedCategory === category
                    ? 'bg-[var(--color-comic-purple)] text-white'
                    : 'bg-[var(--color-comic-yellow)] text-black'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        )}

        {!ideOnly && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {filteredCategories.map((category, idx) => (
            <ScrollReveal key={idx} delay={idx * 130}>
            <div className="comic-outline h-full rounded-[2rem] bg-[var(--color-comic-cream)] p-6">
              <div
                className={`comic-outline-soft mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${category.bgColor} ${category.color}`}
              >
                {category.icon}
              </div>

              <h2 className="display-comic text-2xl leading-tight text-black">{category.title}</h2>

              <div className="mt-5 space-y-3">
                {category.links.map((link, linkIdx) => (
                  <div key={linkIdx} className="comic-outline-soft block rounded-xl bg-[var(--color-comic-yellow)] p-4">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <a href={link.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-base font-black text-black hover:underline">
                        {link.name}
                        <ExternalLink size={16} className="text-black" />
                      </a>
                      <button
                        onClick={() => toggleBookmark(link.name)}
                        className={`rounded-lg border-[2px] border-black p-1.5 ${bookmarks[link.name] ? 'bg-[var(--color-comic-orange)] text-white' : 'bg-white text-black'}`}
                        aria-label={`Toggle bookmark for ${link.name}`}
                      >
                        <Bookmark size={14} fill={bookmarks[link.name] ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                    <p className="text-sm font-bold text-black/80">{link.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            </ScrollReveal>
          ))}
        </div>
        )}

        {!ideOnly && filteredCategories.length === 0 && (
          <div className="mt-6 rounded-2xl border-[3px] border-black bg-[var(--color-comic-cream)] p-6 text-center text-sm font-black">
            No resources found for your current search/filter.
          </div>
        )}

        <div className={`${ideOnly ? 'mt-0' : 'mt-10'} rounded-[2rem] border-[3px] border-black bg-[var(--color-comic-cream)] p-5 shadow-[8px_8px_0_#000] md:p-7`}>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="display-comic text-3xl text-black">{ideOnly ? 'Problem Solving IDE' : 'Problem Solving Arena'}</h2>
              <p className="mt-2 text-sm font-bold text-black/80">
                Pick a problem, write full code, compile-run in-browser, and inspect output instantly.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="comic-outline-soft inline-flex items-center gap-2 rounded-xl bg-[var(--color-comic-yellow)] px-3 py-2 text-xs font-black uppercase text-black">
                <Beaker size={14} />
                In-browser IDE
              </div>
              <div className="comic-outline-soft inline-flex items-center gap-2 rounded-xl bg-[var(--color-comic-red)] px-3 py-2 text-xs font-black uppercase text-white">
                <CheckCircle2 size={14} />
                Solved {solvedProblemCount}/{problemBank.length}
              </div>
            </div>
          </div>

          <div className="mb-5 rounded-xl border-[3px] border-black bg-white p-4">
            <h3 className="text-lg font-black text-black">Why Java, C++, and Python can compile online here</h3>
            <p className="mt-2 text-sm font-bold text-black/85">
              This editor sends your code to <span className="font-black">/api/execute</span>, which runs on the backend after deployment and compiles or executes code on a server, not in your browser tab.
              The browser is only the UI.
            </p>
            <p className="mt-2 text-sm font-bold text-black/85">
              Java and C++ are compiled with installed toolchains, while Python is interpreted by a runtime.
              Since execution happens server-side, the page can support multiple languages through one common workflow.
            </p>
          </div>

          <div className="mb-4 rounded-xl border-[2px] border-black bg-white p-2">
            <div className="mb-1 flex items-center justify-between text-[11px] font-black uppercase text-black">
              <span>Progress</span>
              <span>{solvedPercent}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-lg border-[2px] border-black bg-[var(--color-comic-yellow)]">
              <div
                className="h-full bg-[var(--color-comic-red)] transition-all duration-500"
                style={{ width: `${solvedPercent}%` }}
              />
            </div>
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            {levels.map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`rounded-xl border-[2px] border-black px-3 py-2 text-xs font-black uppercase ${
                  selectedLevel === level
                    ? 'bg-[var(--color-comic-red)] text-white'
                    : 'bg-[var(--color-comic-yellow)] text-black'
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          <div className="grid gap-4 xl:grid-cols-[320px_1fr]">
            <div className="space-y-3">
              {filteredProblems.map((problem) => (
                <button
                  key={problem.id}
                  onClick={() => setSelectedProblemId(problem.id)}
                  className={`w-full rounded-xl border-[3px] p-4 text-left ${
                    selectedProblem.id === problem.id
                      ? 'border-black bg-[var(--color-comic-orange)] text-white'
                      : 'border-black bg-[var(--color-comic-yellow)] text-black'
                  }`}
                >
                  <p className="text-xs font-black uppercase tracking-wide">{problem.level}</p>
                  <h3 className="mt-1 text-base font-black leading-tight">{problem.title}</h3>
                </button>
              ))}

              {filteredProblems.length === 0 && (
                <div className="rounded-xl border-[3px] border-black bg-[var(--color-comic-yellow)] p-4 text-sm font-black">
                  No problems in this level yet.
                </div>
              )}
            </div>

            <div className="rounded-2xl border-[3px] border-black bg-[var(--color-comic-yellow)] p-4">
              <h3 className="text-xl font-black text-black">{selectedProblem.title}</h3>
              <p className="mt-2 text-sm font-bold text-black/80">{selectedProblem.statement}</p>

              <div className="mt-3 flex flex-wrap gap-2">
                {LANGUAGE_OPTIONS.map((language) => (
                  <button
                    key={language}
                    onClick={() => setSelectedLanguage(language)}
                    className={`rounded-lg border-[2px] border-black px-3 py-1.5 text-xs font-black uppercase ${
                      selectedLanguage === language
                        ? 'bg-[var(--color-comic-purple)] text-white'
                        : 'bg-white text-black'
                    }`}
                  >
                    {language}
                  </button>
                ))}
              </div>

              <p className="mt-2 text-xs font-bold text-black/80">
                {selectedLanguage === 'C++'
                  ? 'C++ uses the local service with g++ under the hood. If toolchain is missing, install MinGW-w64/MSYS2 and restart the dev server.'
                  : `Online execution for ${selectedLanguage} runs through the same local service.`}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => setShowHint((prev) => !prev)}
                  className="rounded-lg border-[2px] border-black bg-white px-3 py-1.5 text-xs font-black uppercase text-black"
                >
                  {showHint ? 'Hide Hint' : 'Show Hint'}
                </button>
                <button
                  onClick={() => setShowEditorial((prev) => !prev)}
                  className="rounded-lg border-[2px] border-black bg-white px-3 py-1.5 text-xs font-black uppercase text-black"
                >
                  {showEditorial ? 'Hide Editorial' : 'Show Editorial'}
                </button>
              </div>

              {showHint && (
                <div className="mt-3 rounded-xl border-[2px] border-black bg-[var(--color-comic-cream)] p-3 text-sm font-bold text-black/85">
                  Hint: {selectedProblem.hint || 'Try breaking the problem into smaller subproblems.'}
                </div>
              )}

              {showEditorial && (
                <div className="mt-3 rounded-xl border-[2px] border-black bg-[var(--color-comic-cream)] p-3 text-sm font-bold text-black/85">
                  Editorial: {selectedProblem.editorial || 'No editorial yet.'}
                </div>
              )}

              <div className="mt-4 overflow-hidden rounded-xl border-[3px] border-black bg-[#1e1e1e] p-0">
                <Editor
                  value={editorCode}
                  onValueChange={setEditorCode}
                  highlight={(code) => highlightCode(code, selectedLanguage)}
                  padding={14}
                  textareaId="online-compiler-editor"
                  className="min-h-[280px] w-full font-mono text-sm leading-6"
                  style={{
                    fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                    color: '#d4d4d4',
                    backgroundColor: '#1e1e1e',
                    caretColor: '#ffffff',
                  }}
                />
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={runCode}
                  disabled={isRunning}
                  className="inline-flex items-center gap-2 rounded-xl border-[2px] border-black bg-[var(--color-comic-red)] px-4 py-2 text-sm font-black text-white disabled:opacity-70"
                >
                  <Play size={15} />
                  {isRunning ? 'Compiling...' : 'Compile & Run'}
                </button>
                <button
                  onClick={resetCode}
                  className="inline-flex items-center gap-2 rounded-xl border-[2px] border-black bg-white px-4 py-2 text-sm font-black text-black"
                >
                  <RotateCcw size={15} />
                  Reset Starter
                </button>
              </div>

              {runFeedback && (
                <div className="mt-4 rounded-xl border-[3px] border-black bg-[var(--color-comic-cream)] p-4">
                  {runFeedback.ok ? (
                    <>
                      <div className="mb-3 flex items-center gap-2 text-sm font-black text-black">
                        <CheckCircle2 size={16} className="text-gfg-green" />
                        Program executed successfully
                      </div>
                      <div className="rounded-lg border-[2px] border-black bg-white p-3">
                        <p className="mb-2 text-xs font-black uppercase text-black">Output</p>
                        <pre className="max-h-56 overflow-auto whitespace-pre-wrap break-words font-mono text-xs text-black">
                          {runFeedback.output}
                        </pre>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-start gap-2 text-sm font-black text-red-700">
                      <XCircle size={16} className="mt-0.5" />
                      <span>{runFeedback.error}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-4 rounded-xl border-[3px] border-black bg-[var(--color-comic-cream)] p-3">
                <p className="text-sm font-black text-black">
                  Submission History ({currentUser?.name ? currentUser.name : 'Guest'})
                </p>
                <div className="mt-2 max-h-48 space-y-2 overflow-y-auto pr-1">
                  {submissionHistory.length > 0 ? (
                    submissionHistory.map((entry, idx) => (
                      <div key={`${entry.createdAt}-${idx}`} className="rounded-lg border-[2px] border-black bg-white p-2 text-xs font-bold text-black">
                        <p>{entry.title} • {entry.language}</p>
                        <p className="mt-0.5">{entry.status} • {entry.passed}/{entry.total} tests</p>
                        <p className="mt-0.5 text-black/70">{new Date(entry.createdAt).toLocaleString()}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs font-bold text-black/70">No submissions yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;
