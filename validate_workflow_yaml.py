from pathlib import Path
import sys
try:
    import yaml
except Exception as exc:
    print(f'pyyaml_unavailable: {exc}')
    raise SystemExit(2)
path=Path(sys.argv[1])
data=yaml.safe_load(path.read_text())
assert isinstance(data, dict), 'workflow must be a mapping'
assert 'jobs' in data and 'build' in data['jobs'], 'build job missing'
print(f'valid_yaml jobs={len(data["jobs"])} build_if={data["jobs"]["build"].get("if")}')
