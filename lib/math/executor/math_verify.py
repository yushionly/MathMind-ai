#!/usr/bin/env python3
import argparse
import json


def main() -> None:
    parser = argparse.ArgumentParser(description="Verify two math expressions with SymPy")
    parser.add_argument("--expression", type=str, required=True)
    parser.add_argument("--expected", type=str, required=True)
    args = parser.parse_args()

    try:
        import sympy as sp
    except Exception as e:
        print(json.dumps({"equivalent": False, "error": f"sympy unavailable: {e}"}, ensure_ascii=False))
        return

    try:
        x, y, z = sp.symbols("x y z")
        lhs = sp.sympify(args.expression)
        rhs = sp.sympify(args.expected)
        equivalent = sp.simplify(lhs - rhs) == 0
        print(json.dumps({"equivalent": bool(equivalent)}, ensure_ascii=False))
    except Exception as e:
        print(json.dumps({"equivalent": False, "error": str(e)}, ensure_ascii=False))


if __name__ == "__main__":
    main()
