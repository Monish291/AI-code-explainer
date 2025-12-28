def build_prompt(code):
    return f"""
You are a senior software engineer.

Analyze the following source code written in ANY programming language.

Respond STRICTLY in JSON with these keys:
language,
explanation,
steps,
time_complexity,
space_complexity,
edge_cases,
improvements.

Code:
{code}
"""
