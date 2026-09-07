# Contributing to TerraPath

Thanks for helping improve TerraPath. Fork the project, create a focused branch, and open a pull request explaining the problem, the change, and how you verified it.

1. Run `node server.mjs` to work locally. There are no runtime dependencies to install.
2. Keep numerical functions in `dist/engine.js` independent of the browser. Document units, assumptions and objective functions.
3. For algorithm changes, include a small test with an independently known result or invariant. Run `node --test tests/engine.test.mjs`.
4. Keep labels understandable and preserve keyboard, touch and responsive behavior.
5. Run `node scripts/package.mjs` after source changes to refresh the source download.

For bug reports, include surface dimensions or a small non-sensitive height map, the route objective, grade limit, endpoints, expected result and actual result. Do not include API keys or personal information.

Good first contributions: clearer educational examples, georeferenced data adapters, numerical edge cases, or a documented distance tiebreaker for minimax routes. Propose new dependencies with a reason. Do not label a heuristic as an energy, safety or cost model without defining and validating it.

Contributions are made under the project's MIT license. Be respectful and constructive in discussions.
