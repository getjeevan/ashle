# Ashle - Cloud Kitchen Management System with Jules AI

A modern cloud kitchen management platform featuring real-time order processing, inventory tracking, and delivery coordination—powered by **Jules AI** for autonomous development and optimization.

## What is Ashle?

Ashle is a comprehensive cloud kitchen management system designed to handle:
- 📱 **Multi-brand order management** (operate multiple restaurant brands from one kitchen)
- 📦 **Smart inventory tracking** (prevent overselling, track waste)
- ⏱️ **Kitchen display & prep times** (optimize workflow)
- 🚚 **Delivery integration** (coordinate with delivery partners)
- 📊 **Real-time analytics** (waste, profitability, performance)
- 💰 **Financial tracking** (costs, margins, revenue by brand)

## Jules AI Integration

This project uses **Google's Jules AI** to autonomously handle:
- 🧪 Test generation and coverage improvement
- ⚡ Performance optimization and query analysis
- 📚 Documentation updates and maintenance
- 🐛 Bug detection and fixes
- 🔄 CI/CD failure auto-recovery
- 📈 Feature development and refactoring

### How Jules Works Here

1. **You define tasks** in `jules.config.yaml`
2. **Jules works asynchronously** in the cloud (doesn't block your work)
3. **Creates pull requests automatically** when tasks complete
4. **Auto-fixes CI failures** if something breaks
5. **You review and merge** at your own pace

### Example: A Day with Jules

**Morning:** You ask Jules to "generate tests for inventory module"
- Jules analyzes your code
- Generates comprehensive test cases
- Creates PR automatically
- You review during lunch

**Afternoon:** While you're building new features with Claude Code:
- Jules is optimizing your database queries
- Jules is updating documentation
- Jules is analyzing error logs
- All happening in the background

## Project Structure

```
ashle/
├── src/
│   ├── index.js              # Entry point
│   ├── api/                  # REST API endpoints
│   ├── orders/               # Order management
│   │   ├── service.js
│   │   ├── model.js
│   │   └── __tests__/
│   ├── inventory/            # Inventory system
│   │   ├── service.js
│   │   ├── model.js
│   │   └── __tests__/
│   ├── kitchen/              # Kitchen operations
│   │   ├── display.js
│   │   ├── prep-times.js
│   │   └── __tests__/
│   ├── delivery/             # Delivery tracking
│   │   ├── service.js
│   │   └── __tests__/
│   ├── analytics/            # Analytics & reports
│   │   ├── waste-tracking.js
│   │   ├── profitability.js
│   │   └── __tests__/
│   └── database/             # Database & queries
│       ├── connection.js
│       └── migrations/
├── .github/
│   └── workflows/
│       └── jules-ci.yaml     # Jules GitHub integration
├── jules.config.yaml         # Jules task definitions
├── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 16+
- Git
- Jules CLI (optional, for local testing)

### Setup

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env

# Start development server
npm run dev
```

### Configure Jules

Jules is already configured in `julius.config.yaml`. To customize:

1. Edit `julius.config.yaml` with your task definitions
2. Commit and push to your branch
3. Jules will automatically pick up tasks on:
   - Schedule (daily, weekly, bi-weekly)
   - Push events (when specific files change)
   - Manual triggers (via API or CLI)

## Key Features

### 1. Order Management
- Real-time order tracking across multiple brands
- Prevention of overselling with atomic inventory updates
- Order status visibility for customers and kitchen staff

### 2. Inventory System
- Stock level monitoring
- Low-stock alerts
- Automated waste tracking
- Historical usage analytics

### 3. Kitchen Display
- Real-time prep times
- Order prioritization
- Staff workload balancing

### 4. Analytics Dashboard
- Daily waste metrics
- Profitability by dish/brand
- Peak hour analysis
- Delivery partner performance

## Jules Tasks in Action

### Task: Test Generation
Jules automatically generates tests when code changes:
```yaml
- name: "generate-tests"
  triggers:
    - on_push: "src/orders/*"
    - schedule: "weekly"
```

**Result:** Your code always has 80%+ test coverage

### Task: Performance Optimization
Jules runs daily performance analysis:
```yaml
- name: "optimize-queries"
  schedule: "bi-weekly"
```

**Result:** Slow queries fixed automatically, API response times improved

### Task: Documentation
Jules keeps docs in sync:
```yaml
- name: "update-documentation"
  triggers:
    - on_push: "src/**/*.js"
```

**Result:** Always up-to-date API docs and code comments

## Development with Claude Code + Jules

**Claude Code** handles interactive tasks:
- Bug fixes (you see & control in real-time)
- New feature development
- Quick optimizations
- Testing locally

**Jules** handles background tasks:
- Test generation
- Refactoring
- Documentation
- Performance analysis
- CI failure recovery

They work in parallel—you stay productive while Jules handles the tedious work.

## API Endpoints (Coming Soon)

```
POST /api/orders              # Create order
GET  /api/orders/:id          # Get order status
GET  /api/inventory           # Get inventory levels
POST /api/inventory/adjust    # Adjust stock
GET  /api/kitchen/display     # Kitchen display
GET  /api/analytics/waste     # Waste reports
GET  /api/analytics/profit    # Profitability
```

## Configuration

### Environment Variables
```bash
DATABASE_URL=postgresql://...
JULES_API_KEY=your-jules-key
GITHUB_TOKEN=your-github-token
NODE_ENV=development
```

### Jules Configuration
See `julius.config.yaml` for full task definitions, schedules, and triggers.

## Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes (Claude Code for interactive work)
3. Push to branch
4. Jules will:
   - Generate tests
   - Run performance analysis
   - Update documentation
   - Create PR with improvements
5. Review and merge

## Jules Auto-Fix

If CI fails on a Jules-generated PR:
1. Jules receives the error
2. Analyzes the failure
3. Applies the fix
4. Re-pushes automatically

You'll never be blocked by flaky CI again.

## Next Steps

1. **Initialize the database schema** — Create initial tables for orders, inventory, etc.
2. **Build order API** — Implement core order creation and status tracking
3. **Implement inventory service** — Prevent overselling, track stock
4. **Set up kitchen display** — Real-time order visualization
5. **Add analytics** — Waste and profitability tracking

## Resources

- [Jules Documentation](https://jules.google.com/)
- [Jules CLI Tools](https://blog.google/technology/google-labs/jules-tools-jules-api/)
- [Cloud Kitchen Best Practices](#)

## License

MIT

---

**Built with Claude Code + Jules AI** 🚀
Interactive development meets autonomous optimization.
