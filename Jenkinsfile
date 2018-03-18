#!/usr/bin/env groovy

pipeline {
    agent {
        label 'inyoka-slave'
    }
    stages {
        stage('Build virtualenv') {
            steps {
                sh '''virtualenv venv
                . ./venv/bin/activate
                pip install -e .
                pip install -r tests/requirements.txt'''
            }
        }
        stage ('Tests') {
            steps {
                sh '''. venv/bin/activate
                nosetests --with-xcoverage --with-xunit'''
            }
        }
    }
    post {
        always {
            junit '**/nosetests.xml'
        }
    }
}
