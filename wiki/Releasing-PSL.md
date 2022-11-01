---
layout: wiki
---

The PSL release process is fairly straightforward,
but does require coordinating between several repositories (which should all get matching versions/tags):
 - [psl](https://github.com/linqs/psl)
 - [psl-examples](https://github.com/linqs/psl-examples)
 - [psl-website](https://github.com/linqs/psl-website)

In this document, we will assume we are releasing version `2.3.1` (thus our SNAPSHOT version will not change).
Make sure to change this to fit your situation.
Additionally, make sure you read and understands commands before you execute them.

Of course, before you start anything make sure all your repositories are clean and up-to-date.

The first step in releasing is running tests:
```
### psl

mvn clean install
./.ci/style-and-lint.sh
```
Then test the psl-examples:
```
### psl-examples

# Remove all existing jars from the examples repo.
find . -name 'psl*.jar' | xargs rm

# Run tests.
./.ci/check_conventions.sh
./.ci/run_interface_examples.sh
./.ci/run_examples.sh
```

Now that all tests are passing, we will release PSL:
```
### psl

# Change PSL's version.
sed -i 's/3.0.0-SNAPSHOT/2.3.1/' pom.xml */pom.xml

# Check your changes.
git diff

# Commit the new version and push.
git commit -a -m "Version 2.3.1."
git push

# Ensure CI passes, then push the release (tag).
git tag 2.3.1
git push --tags

# Change the version to the next snapshot.
sed -i 's/2.3.1/3.0.0-SNAPSHOT/' pom.xml */pom.xml

# Check your changes.
git diff

# Commit the new version and push.
git commit -a -m "Updated version for next snapshot."
git push
```

Now wait for the CI to finish deployment.
Maven Central takes a while to update, but you should be all set once Sonatype shows the updated version [on Nexus](https://oss.sonatype.org/#nexus-search;quick~org.linqs).

Once the PSL release is available, we can release PSL Examples.
Note that version numbers here are changed in the template generation script (which is then run to re-generate all the run scripts).
`SCRIPT_VERSION` should just get a path version bump (the last number) and `PSL_VERSION` should match the new release.
```
### psl-examples

# Update the versions (SCRIPT_VERSION and PSL_VERSION).
vim .templates/generate_scripts.py
./.templates/generate_scripts.py

# Check your changes.
git diff

# Ensure the new version can be properly fetched by removing previous jars.
# You may have to wait a while for it to be available.
find . -name 'psl*.jar' | xargs rm
./.ci/run_interface_examples.sh

# Commit the new version and push.
git commit -a -m "Version 2.3.1."
git push

# Ensure CI passes, then push the release (tag).
git tag 2.3.1
git push --tags

# Change PSL_VERSION to the next snapshot and increment SCRIPT_VERSION.
vim .templates/generate_scripts.py
./.templates/generate_scripts.py

# Check your changes.
git diff

# Commit the new version and push.
git commit -a -m "Updated version for next snapshot."
git push
```

Finally, the PSL website should be tagged.
No code changes are necessary, just push the new tag.
```
### psl-website

git tag 2.3.1
git push --tags
```
