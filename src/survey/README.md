# Survey

Survey core library [doc](https://docs.google.com/drawings/d/1f79jlG8rZ8pIGQoxZ5Lf_AGXT3OrtFqxqmJ8LcppuAI).

## Roadmap

- [✓] form-item
- [✓] db-source questions
- [✓] conditional items
- [] survey integration tests
- [] documentation
- [] medicine functions refactor and coverage

- question options validatable

TODO:
Item represents a single item -> Questions, ItemFunction (are always leaves)
Group is an ItemConditional with childs (recursive)

Score lib -> functions executable

## Testing

Run `nx test survey` to execute the unit tests via [Jest](https://jestjs.io).

Integration tests are located in `src/test/`

Test coverage
