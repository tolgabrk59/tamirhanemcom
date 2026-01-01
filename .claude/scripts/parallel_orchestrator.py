#!/usr/bin/env python3
"""
Parallel Agent Orchestrator - Coordinator that runs multiple local agents in parallel.
Each agent shares status upon completion, and a synthesis report is generated at the end.

Usage:
    python scripts/parallel_orchestrator.py "Your task..." --agents 3
"""

import os
import json
import sys
import uuid
import time
import subprocess
import threading
from pathlib import Path
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import Dict, List, Any, Optional

# Debug logging
DEBUG_LOG = Path.home() / ".claude" / "data" / "hook_debug.log"

def debug_log(message: str):
    """Write debug log."""
    try:
        DEBUG_LOG.parent.mkdir(parents=True, exist_ok=True)
        with open(DEBUG_LOG, "a", encoding="utf-8") as f:
            timestamp = datetime.now().isoformat()
            f.write(f"[{timestamp}] parallel_orchestrator.py: {message}\n")
    except Exception as e:
        sys.stderr.write(f"DEBUG_LOG_ERROR: {e}\n")

# Paths
CLAUDE_DIR = Path.home() / ".claude"
DATA_DIR = CLAUDE_DIR / "data"
ORCHESTRATOR_STATE_FILE = DATA_DIR / "orchestrator-state.json"

class AgentTask:
    def __init__(self, agent_id: str, prompt: str, name: str = ""):
        self.agent_id = agent_id
        self.prompt = prompt
        self.name = name or f"Agent-{agent_id[:4]}"
        self.status = "pending"
        self.result = ""
        self.started_at = None
        self.ended_at = None

    def execute(self, test_mode: bool = False):
        debug_log(f"AgentTask.execute: {self.name}, test_mode={test_mode}")
        self.status = "running"
        self.started_at = datetime.now().isoformat()

        try:
            if test_mode:
                # Mock execution
                import random
                sleep_time = random.uniform(2, 5)
                debug_log(f"Mock execution: {self.name}, sleep={sleep_time:.2f}s")
                time.sleep(sleep_time)
                self.result = f"MOCK RESULT for {self.name}: Analyzed {self.prompt[:30]}... found 3 issues."
                self.status = "completed"
            else:
                # Real execution using Claude Code CLI
                debug_log(f"Real execution: claude {self.prompt[:50]}...")
                process = subprocess.Popen(
                    ["claude", self.prompt],
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    text=True,
                    encoding="utf-8"
                )

                stdout, stderr = process.communicate()
                debug_log(f"Process finished: {self.name}, returncode={process.returncode}")

                self.result = stdout
                if process.returncode != 0:
                    self.status = "failed"
                    self.error = stderr
                    debug_log(f"Agent {self.name} failed: {stderr[:100]}")
                else:
                    self.status = "completed"
                    debug_log(f"Agent {self.name} completed successfully")

        except Exception as e:
            self.status = "failed"
            self.error = str(e)
            debug_log(f"Agent {self.name} exception: {type(e).__name__}: {e}")

        self.ended_at = datetime.now().isoformat()
        return self

class Orchestrator:
    def __init__(self, main_prompt: str, agent_count: int = 3, test_mode: bool = False):
        self.main_prompt = main_prompt
        self.agent_count = agent_count
        self.test_mode = test_mode
        self.session_id = str(uuid.uuid4())
        self.tasks: List[AgentTask] = []
        self.results = {}
        debug_log(f"Orchestrator.__init__: session_id={self.session_id[:8]}, agents={agent_count}, test_mode={test_mode}")

    def ensure_dirs(self):
        DATA_DIR.mkdir(parents=True, exist_ok=True)

    def initialize_tasks(self):
        """Divide main prompt by agent count and assign to relevant local agent."""
        debug_log(f"initialize_tasks: creating {self.agent_count} tasks")
        # Task - Agent matching
        agent_map = [
            {"perspective": "Architecture & Security", "agent": "security-auditor", "skills": "security-checklist, api-patterns"},
            {"perspective": "Backend Implementation", "agent": "backend-specialist", "skills": "nodejs-best-practices, api-patterns"},
            {"perspective": "Frontend & UI/UX", "agent": "frontend-specialist", "skills": "react-patterns, tailwind-patterns"},
            {"perspective": "Testing", "agent": "test-engineer", "skills": "testing-patterns, webapp-testing"},
            {"perspective": "DevOps & Performance", "agent": "devops-engineer", "skills": "deployment-procedures, server-management"}
        ]
        
        for i in range(self.agent_count):
            map_item = agent_map[i % len(agent_map)]
            perspective = map_item["perspective"]
            agent_name = map_item["agent"]
            skills = map_item["skills"]
            
            # Sub-agent tetikleyici komut ekle
            sub_prompt = f"Use the {agent_name} agent with {skills} skills to focus on {perspective}: {self.main_prompt}"

            agent_id = str(uuid.uuid4())
            task = AgentTask(agent_id, sub_prompt, f"{agent_name}")
            self.tasks.append(task)
            debug_log(f"Task created: {agent_name} ({perspective})")

    def save_state(self):
        state = {
            "session_id": self.session_id,
            "timestamp": datetime.now().isoformat(),
            "main_prompt": self.main_prompt,
            "tasks": [
                {
                    "id": t.agent_id,
                    "name": t.name,
                    "status": t.status,
                    "started_at": t.started_at,
                    "ended_at": t.ended_at,
                    "result_snippet": t.result[:200] if t.result else ""
                } for t in self.tasks
            ]
        }
        ORCHESTRATOR_STATE_FILE.write_text(json.dumps(state, indent=2, ensure_ascii=False), encoding="utf-8")
        debug_log(f"State saved: {len(self.tasks)} tasks")

    def run(self):
        debug_log("Orchestrator.run: starting")
        self.ensure_dirs()
        self.initialize_tasks()
        self.save_state()
        
        mode_str = " (TEST MODE)" if self.test_mode else ""
        print(f"🚀 Orchestrator started: {self.session_id}{mode_str}")
        print(f"👥 Spawning {self.agent_count} parallel agents...")
        
        with ThreadPoolExecutor(max_workers=self.agent_count) as executor:
            futures = {executor.submit(task.execute, self.test_mode): task for task in self.tasks}
            debug_log(f"Submitted {len(futures)} tasks to ThreadPoolExecutor")

            for future in as_completed(futures):
                task = futures[future]
                try:
                    task = future.result()
                    print(f"✅ {task.name} finished: {task.status}")
                    debug_log(f"Task {task.name} finished: {task.status}")
                except Exception as e:
                    print(f"❌ {task.name} crashed: {e}")
                    debug_log(f"Task {task.name} crashed: {type(e).__name__}: {e}")

                self.save_state()

        self.synthesize()

    def synthesize(self):
        """Collect all agent results and create a synthesis."""
        debug_log("Synthesis: starting")
        print("\n🧠 Synthesizing results...")
        
        synthesis_content = f"# Parallel Agents Synthesis Report\n"
        synthesis_content += f"**Session ID**: {self.session_id}\n"
        synthesis_content += f"**Main Objective**: {self.main_prompt}\n\n"
        synthesis_content += "---\n\n"
        
        for t in self.tasks:
            synthesis_content += f"### {t.name}\n"
            synthesis_content += f"- **Task**: {t.prompt[:100]}...\n"
            synthesis_content += f"- **Status**: {t.status}\n"
            synthesis_content += f"- **Key Findings**:\n\n{t.result if t.result else 'No output generated.'}\n\n"
            synthesis_content += "---\n\n"
        
        reports_dir = DATA_DIR / "reports"
        reports_dir.mkdir(parents=True, exist_ok=True)
        report_file = reports_dir / f"synthesis_report_{self.session_id[:8]}.md"
        report_file.write_text(synthesis_content, encoding="utf-8")

        print(f"✨ Final synthesis report generated: {report_file}")
        debug_log(f"Synthesis report saved: {report_file}")
        
def main():
    debug_log(f"MAIN called: argv={sys.argv}")

    if len(sys.argv) < 2:
        print("Usage: python scripts/parallel_orchestrator.py \"your task\" [--agents N] [--test]")
        return
    
    prompt = sys.argv[1]
    agents = 3
    test_mode = "--test" in sys.argv

    debug_log(f"Parsed: prompt={prompt[:50]}..., agents={agents}, test_mode={test_mode}")

    if "--agents" in sys.argv:
        idx = sys.argv.index("--agents")
        if idx + 1 < len(sys.argv):
            try:
                agents = int(sys.argv[idx + 1])
                debug_log(f"Agent count set to: {agents}")
            except ValueError:
                debug_log(f"Invalid agent count, using default: {agents}")

    try:
        orchestrator = Orchestrator(prompt, agents, test_mode)
        orchestrator.run()
        debug_log("Orchestrator.run completed")
    except Exception as e:
        debug_log(f"ORCHESTRATOR ERROR: {type(e).__name__}: {e}")
        import traceback
        debug_log(f"TRACEBACK: {traceback.format_exc()}")
        raise

if __name__ == "__main__":
    main()

if __name__ == "__main__":
    main()
