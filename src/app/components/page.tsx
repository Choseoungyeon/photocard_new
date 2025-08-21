'use client';

import * as React from 'react';
import Button from '../_component/Button';
import Input from '../_component/Input';
import Card from '../_component/Card';
import Badge from '../_component/Badge';
import Avatar from '../_component/Avatar';
import '@/app/style/page/components.scss';

export default function ComponentsPage() {
  const [inputValue, setInputValue] = React.useState('');
  const [badges, setBadges] = React.useState(['React', 'TypeScript', 'Next.js']);

  const removeBadge = (badgeToRemove: string) => {
    setBadges(badges.filter((badge) => badge !== badgeToRemove));
  };

  return (
    <div className="components-page">
      <div className="components-header">
        <h1>컴포넌트 라이브러리</h1>
        <p>Linear Light Theme 기반의 재사용 가능한 컴포넌트들</p>
      </div>

      <div className="components-grid">
        {/* Button Section */}
        <section className="component-section">
          <h2>Button</h2>
          <div className="component-demo">
            <div className="demo-group">
              <h3>Variants</h3>
              <div className="demo-row">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
              </div>
            </div>

            <div className="demo-group">
              <h3>Sizes</h3>
              <div className="demo-row">
                <Button size="small">Small</Button>
                <Button size="medium">Medium</Button>
                <Button size="large">Large</Button>
              </div>
            </div>

            <div className="demo-group">
              <h3>States</h3>
              <div className="demo-row">
                <Button>Normal</Button>
                <Button disabled>Disabled</Button>
                <Button loading>Loading</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Input Section */}
        <section className="component-section">
          <h2>Input</h2>
          <div className="component-demo">
            <div className="demo-group">
              <h3>Basic Input</h3>
              <Input
                label="이메일"
                placeholder="이메일을 입력하세요"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>

            <div className="demo-group">
              <h3>Sizes</h3>
              <Input size="small" placeholder="Small input" />
              <Input size="medium" placeholder="Medium input" />
              <Input size="large" placeholder="Large input" />
            </div>

            <div className="demo-group">
              <h3>States</h3>
              <Input placeholder="Normal input" />
              <Input placeholder="Disabled input" disabled />
              <Input placeholder="Error input" error="이 필드는 필수입니다" />
            </div>

            <div className="demo-group">
              <h3>Password Input</h3>
              <Input
                type="password"
                label="비밀번호"
                placeholder="비밀번호를 입력하세요"
                showPassword
              />
            </div>

            <div className="demo-group">
              <h3>Textarea</h3>
              <Input type="textarea" label="설명" placeholder="설명을 입력하세요" rows={4} />
            </div>
          </div>
        </section>

        {/* Card Section */}
        <section className="component-section">
          <h2>Card</h2>
          <div className="component-demo">
            <div className="demo-group">
              <h3>Variants</h3>
              <div className="demo-row">
                <Card variant="default" className="demo-card">
                  <h4>Default Card</h4>
                  <p>기본 카드 스타일입니다.</p>
                </Card>
                <Card variant="elevated" className="demo-card">
                  <h4>Elevated Card</h4>
                  <p>그림자가 있는 카드입니다.</p>
                </Card>
                <Card variant="outlined" className="demo-card">
                  <h4>Outlined Card</h4>
                  <p>테두리만 있는 카드입니다.</p>
                </Card>
              </div>
            </div>

            <div className="demo-group">
              <h3>Sizes & Padding</h3>
              <div className="demo-row">
                <Card size="small" padding="small" className="demo-card">
                  <h4>Small</h4>
                  <p>작은 카드</p>
                </Card>
                <Card size="medium" padding="medium" className="demo-card">
                  <h4>Medium</h4>
                  <p>중간 카드</p>
                </Card>
                <Card size="large" padding="large" className="demo-card">
                  <h4>Large</h4>
                  <p>큰 카드</p>
                </Card>
              </div>
            </div>

            <div className="demo-group">
              <h3>Interactive</h3>
              <div className="demo-row">
                <Card
                  variant="elevated"
                  className="demo-card"
                  onClick={() => alert('카드가 클릭되었습니다!')}
                >
                  <h4>Clickable Card</h4>
                  <p>클릭할 수 있는 카드입니다.</p>
                </Card>
              </div>
            </div>

            <div className="demo-group">
              <h3>With Header & Footer</h3>
              <Card
                variant="elevated"
                className="demo-card"
                header={<div style={{ fontWeight: 'bold', color: '#5E6AD2' }}>카드 헤더</div>}
                footer={<div style={{ textAlign: 'right' }}>카드 푸터</div>}
              >
                <h4>Card with Header & Footer</h4>
                <p>헤더와 푸터가 있는 카드입니다.</p>
              </Card>
            </div>
          </div>
        </section>

        {/* Badge Section */}
        <section className="component-section">
          <h2>Badge</h2>
          <div className="component-demo">
            <div className="demo-group">
              <h3>Variants</h3>
              <div className="demo-row">
                <Badge variant="default">Default</Badge>
                <Badge variant="primary">Primary</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="error">Error</Badge>
                <Badge variant="info">Info</Badge>
              </div>
            </div>

            <div className="demo-group">
              <h3>Sizes</h3>
              <div className="demo-row">
                <Badge size="small">Small</Badge>
                <Badge size="medium">Medium</Badge>
                <Badge size="large">Large</Badge>
              </div>
            </div>

            <div className="demo-group">
              <h3>With Dot</h3>
              <div className="demo-row">
                <Badge variant="success" dot>
                  Online
                </Badge>
                <Badge variant="warning" dot>
                  Pending
                </Badge>
                <Badge variant="error" dot>
                  Error
                </Badge>
              </div>
            </div>

            <div className="demo-group">
              <h3>Removable</h3>
              <div className="demo-row">
                {badges.map((badge) => (
                  <Badge
                    key={badge}
                    variant="primary"
                    removable
                    onRemove={() => removeBadge(badge)}
                  >
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Avatar Section */}
        <section className="component-section">
          <h2>Avatar</h2>
          <div className="component-demo">
            <div className="demo-group">
              <h3>Sizes</h3>
              <div className="demo-row">
                <Avatar size="xs" fallback="JD" />
                <Avatar size="sm" fallback="JD" />
                <Avatar size="md" fallback="JD" />
                <Avatar size="lg" fallback="JD" />
                <Avatar size="xl" fallback="JD" />
              </div>
            </div>

            <div className="demo-group">
              <h3>Variants</h3>
              <div className="demo-row">
                <Avatar variant="circle" fallback="JD" />
                <Avatar variant="square" fallback="JD" />
              </div>
            </div>

            <div className="demo-group">
              <h3>With Status</h3>
              <div className="demo-row">
                <Avatar size="lg" fallback="JD" status="online" />
                <Avatar size="lg" fallback="JD" status="offline" />
                <Avatar size="lg" fallback="JD" status="away" />
                <Avatar size="lg" fallback="JD" status="busy" />
              </div>
            </div>

            <div className="demo-group">
              <h3>With Image</h3>
              <div className="demo-row">
                <Avatar
                  size="lg"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                  alt="User"
                  fallback="JD"
                />
                <Avatar
                  size="lg"
                  src="https://invalid-url.com/image.jpg"
                  alt="Invalid"
                  fallback="JD"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
