#!/usr/bin/env python3
"""
Command-line interface for WebTestBot.

Usage:
    python -m python_bot.cli <url> [--bots=N]
"""

import asyncio
import sys
import argparse
from typing import Dict, Any
from python_bot.core.bot import WebBot, BotReport
from python_bot.config.models import BotConfig


def print_update(update: Dict[str, Any]) -> None:
    """Print progress update to console."""
    update_type = update.get('type', 'INFO').upper()
    message = update.get('message', '')
    print(f'[{update_type}] {message}')
    
    if 'analysis' in update:
        analysis = update['analysis']
        print(f'   📊 Analysis: {analysis.link_count} links, {analysis.form_count} forms')


def print_report(report: BotReport) -> None:
    """Print detailed test report."""
    print('\n' + '='*50)
    print('📋 TEST REPORT')
    print('='*50)
    
    print(f'\n✅ Success: {report.success}')
    print(f'📊 Actions: {len(report.actions)}')
    print(f'❌ Errors: {len(report.errors)}')
    
    if report.performance:
        print(f'\n⚡ Performance:')
        print(f'   Load Time: {report.performance.get("load_time", 0):.0f}ms')
        print(f'   Response Time: {report.performance.get("response_time", 0):.0f}ms')
    
    if report.analysis:
        print(f'\n📄 Page Analysis:')
        print(f'   Title: {report.analysis.title}')
        print(f'   URL: {report.analysis.url}')
        print(f'   Links: {report.analysis.link_count}')
        print(f'   Forms: {report.analysis.form_count}')
        print(f'   Buttons: {report.analysis.button_count}')
        print(f'   Images: {report.analysis.image_count}')
    
    if report.errors:
        print(f'\n❌ Errors:')
        for idx, error in enumerate(report.errors, 1):
            print(f'   {idx}. {error.get("type")}: {error.get("message")}')
    
    if report.actions:
        print(f'\n✅ Actions:')
        for idx, action in enumerate(report.actions, 1):
            print(f'   {idx}. {action.action_type}: {action.status}')


async def run_single_bot(url: str, config: BotConfig) -> BotReport:
    """Run a single bot test."""
    bot = WebBot(config)
    return await bot.run_test(url, on_update=print_update)


async def main() -> None:
    """Main entry point for CLI."""
    parser = argparse.ArgumentParser(
        description='WebTestBot - Python-based web automation and testing'
    )
    parser.add_argument(
        'url',
        nargs='?',
        default='https://hasanarthuraltuntas.com.tr',
        help='Target URL to test (default: hasanarthuraltuntas.com.tr)'
    )
    parser.add_argument(
        '--bots',
        type=int,
        default=1,
        help='Number of concurrent bots (default: 1, max: 10)'
    )
    parser.add_argument(
        '--headless',
        action='store_false',
        dest='headless',
        help='Disable headless mode (default: headless enabled)'
    )
    
    args = parser.parse_args()
    
    if not args.url.startswith(('http://', 'https://')):
        print('❌ Error: URL must start with http:// or https://')
        sys.exit(1)
    
    if args.bots < 1 or args.bots > 10:
        print('❌ Error: Number of bots must be between 1 and 10')
        sys.exit(1)
    
    print('🤖 WebTestBot - Python Implementation')
    print(f'📡 Testing: {args.url}')
    print(f'🤖 Bots: {args.bots}')
    print()
    
    config = BotConfig()
    config.browser.headless = args.headless
    
    if args.bots == 1:
        report = await run_single_bot(args.url, config)
        print_report(report)
    else:
        print(f'🚀 Running {args.bots} concurrent bots...\n')
        tasks = [run_single_bot(args.url, config) for _ in range(args.bots)]
        reports = await asyncio.gather(*tasks)
        
        for idx, report in enumerate(reports, 1):
            print(f'\n{"="*50}')
            print(f'BOT #{idx} REPORT')
            print_report(report)
        
        success_count = sum(1 for r in reports if r.success)
        print(f'\n{"="*50}')
        print(f'📊 SUMMARY: {success_count}/{args.bots} bots succeeded')
        print('='*50)


if __name__ == '__main__':
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print('\n\n⚠️  Test interrupted by user')
        sys.exit(130)
    except Exception as error:
        print(f'\n❌ Fatal error: {error}')
        sys.exit(1)
