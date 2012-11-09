set :default_stage, 'staging'
require 'capistrano/ext/multistage'

## Generated with 'brightbox' on Thu Apr 21 11:12:49 +0100 2011
gem 'brightbox', '>=2.3.9'
require 'brightbox/recipes'
require 'brightbox/passenger'

# The name of your application.  Used for deployment directory and filenames
# and Apache configs. Should be unique on the Brightbox
set :application, "pica.js"


# Target directory for the application on the web and app servers.
set(:deploy_to) { File.join("", "home", user, application) }

# URL of your source repository. By default this will just upload
# the local directory.  You should probably change this if you use
# another repository, like git or subversion.

#set :deploy_via, :copy
set :repository, "git@github.com:unepwcmc/pica.js.git"

set :scm, :git
set :branch, "master"
set :scm_username, "unepwcmc-read"
set :git_enable_submodules, 1
default_run_options[:pty] = true # Must be set for the password prompt from git to work

# stop app from trying to use rake
namespace :deploy do
  namespace :rake_tasks do
    task :singleton, :roles => :db, :only => {:primary => true} do
      puts "do nothing"
    end
  end
end
