"""
Configuration models using Pydantic for type safety and validation.
"""

from typing import List, Literal, Optional
from pydantic import BaseModel, Field, HttpUrl


class ViewportConfig(BaseModel):
    """Browser viewport configuration."""
    width: int = Field(default=1366, ge=800, le=3840)
    height: int = Field(default=768, ge=600, le=2160)


class BrowserConfig(BaseModel):
    """Browser launch configuration."""
    headless: bool = True
    timeout: int = Field(default=60000, ge=5000, le=120000)
    args: List[str] = Field(default_factory=lambda: [
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
    ])


class ContextConfig(BaseModel):
    """Browser context configuration."""
    user_agent: str = Field(
        default='Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
                'AppleWebKit/537.36 (KHTML, like Gecko) '
                'Chrome/120.0.0.0 Safari/537.36'
    )
    viewport: ViewportConfig = Field(default_factory=ViewportConfig)
    timeout: int = Field(default=30000, ge=5000, le=60000)


class PageConfig(BaseModel):
    """Page-level configuration."""
    default_timeout: int = Field(default=30000, ge=5000, le=60000)
    navigation_timeout: int = Field(default=30000, ge=5000, le=60000)
    wait_until: Literal['load', 'domcontentloaded', 'networkidle'] = 'networkidle'


class ConcurrencyConfig(BaseModel):
    """Concurrency limits configuration."""
    max_bots: int = Field(default=10, ge=1, le=100)
    min_bots: int = Field(default=1, ge=1)
    default_bots: int = Field(default=1, ge=1)


class ActionConfig(BaseModel):
    """Action-specific configuration."""
    enabled: bool = True
    wait_time: int = Field(default=1000, ge=0, le=10000)


class TestingConfig(BaseModel):
    """Testing behavior configuration."""
    default_url: HttpUrl = 'https://hasanarthuraltuntas.com.tr'
    retry_attempts: int = Field(default=3, ge=0, le=10)
    retry_delay: int = Field(default=1000, ge=100, le=10000)
    scroll: ActionConfig = Field(default_factory=ActionConfig)
    link_click: ActionConfig = Field(default_factory=lambda: ActionConfig(wait_time=2000))
    form_interaction: ActionConfig = Field(default_factory=lambda: ActionConfig(wait_time=500))


class BotConfig(BaseModel):
    """Complete bot configuration."""
    browser: BrowserConfig = Field(default_factory=BrowserConfig)
    context: ContextConfig = Field(default_factory=ContextConfig)
    page: PageConfig = Field(default_factory=PageConfig)
    concurrency: ConcurrencyConfig = Field(default_factory=ConcurrencyConfig)
    testing: TestingConfig = Field(default_factory=TestingConfig)

    class Config:
        """Pydantic configuration."""
        validate_assignment = True
